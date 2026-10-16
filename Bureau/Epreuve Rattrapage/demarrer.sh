#!/usr/bin/env bash
#
# Démarre tout l'environnement de l'épreuve en une seule commande :
#   1. PostgreSQL dans Docker (port 5433)
#   2. le backend Spring Boot (port 8080)
#   3. l'écran Angular (port 4200)
#
#   Usage   : ./demarrer.sh
#   Arrêt   : Ctrl+C (arrête le backend et l'écran, la base reste allumée)
#
# Chaque service déjà démarré est laissé tel quel : relancer le script ne casse rien.

set -euo pipefail

RACINE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
JOURNAUX="$RACINE/logs"
API_URL="http://localhost:8080/api/tickets"
SWAGGER_URL="http://localhost:8080/swagger-ui.html"
ECRAN_URL="http://localhost:4200"

BACKEND_PID=""
FRONTEND_PID=""

etape() { printf '\n\033[1m==> %s\033[0m\n' "$*"; }
info()  { printf '    %s\n' "$*"; }
souci() { printf '\033[31m    %s\033[0m\n' "$*"; }

# Vrai dès que le serveur répond, quel que soit le code HTTP.
repond() { curl -s -o /dev/null --max-time 3 "$1"; }

# attendre_http <url> <secondes> [pid] ; renvoie 0 si prêt, 2 si le processus est mort, 1 sinon.
attendre_http() {
  local url="$1" limite="$2" pid="${3:-}"
  local debut=$SECONDS
  while (( SECONDS - debut < limite )); do
    repond "$url" && return 0
    if [[ -n "$pid" ]] && ! kill -0 "$pid" 2>/dev/null; then
      return 2
    fi
    sleep 2
  done
  return 1
}

# Lance une commande dans son propre groupe de processus, pour pouvoir l'arrêter
# entièrement (Maven laisse un java derrière lui, ng serve un node).
lancer_en_fond() { # <dossier> <journal> <commande...>
  local dossier="$1" journal="$2"
  shift 2
  setsid bash -c 'cd "$1" || exit 1; shift; exec "$@"' _ "$dossier" "$@" \
    >"$journal" 2>&1 &
  echo $!
}

arreter() {
  printf '\n'
  etape "Arrêt du backend et de l'écran (la base PostgreSQL reste allumée)"
  local pid
  for pid in "$BACKEND_PID" "$FRONTEND_PID"; do
    [[ -z "$pid" ]] && continue
    kill -- "-$pid" 2>/dev/null || kill "$pid" 2>/dev/null || true
  done
  info "Pour tout arrêter, y compris la base : docker compose down"
  # Sans ce exit, bash reprend la commande interrompue après le gestionnaire et
  # le script resterait à attendre un service qu'on vient d'arrêter.
  exit 130
}

trap arreter INT TERM

for outil in docker mvn java node; do
  if ! command -v "$outil" >/dev/null; then
    souci "L'outil « $outil » est introuvable. Installez-le avant de relancer."
    exit 1
  fi
done

mkdir -p "$JOURNAUX"

# ---------------------------------------------------------------- 1. PostgreSQL
etape "1/3  Base PostgreSQL (Docker)"
( cd "$RACINE" && docker compose up -d )

conteneur="$( cd "$RACINE" && docker compose ps -q postgres )"
debut=$SECONDS
while (( SECONDS - debut < 60 )); do
  etat="$( docker inspect --format '{{if .State.Health}}{{.State.Health.Status}}{{else}}{{.State.Status}}{{end}}' "$conteneur" 2>/dev/null || echo inconnu )"
  [[ "$etat" == "healthy" || "$etat" == "running" ]] && break
  sleep 2
done
if [[ "$etat" != "healthy" && "$etat" != "running" ]]; then
  souci "La base n'est pas prête (état : $etat)."
  exit 1
fi
info "prête sur localhost:5433 — base « tickets », utilisateur « ticket_user »"

# ------------------------------------------------------------------- 2. Backend
etape "2/3  Backend Spring Boot (port 8080)"
if repond "$API_URL"; then
  info "déjà démarré, je le laisse tourner"
else
  BACKEND_PID="$( lancer_en_fond "$RACINE/backend" "$JOURNAUX/backend.log" \
    mvn -B spring-boot:run )"
  info "compilation et démarrage (journal : logs/backend.log)…"
  set +e
  attendre_http "$API_URL" 300 "$BACKEND_PID"
  resultat=$?
  set -e
  case $resultat in
    0) info "démarré — http://localhost:8080/api/tickets" ;;
    2) souci "le backend s'est arrêté. Dernières lignes du journal :"
       tail -n 25 "$JOURNAUX/backend.log"
       exit 1 ;;
    *) souci "le backend n'a pas répondu en 5 minutes. Journal : logs/backend.log"
       exit 1 ;;
  esac
fi

# ------------------------------------------------------------------ 3. Frontend
etape "3/3  Écran Angular (port 4200)"
if repond "$ECRAN_URL"; then
  info "déjà démarré, je le laisse tourner"
else
  if [[ ! -d "$RACINE/frontend/node_modules" ]]; then
    info "installation des dépendances (npm install)…"
    ( cd "$RACINE/frontend" && npm install ) >"$JOURNAUX/npm-install.log" 2>&1
  fi
  FRONTEND_PID="$( lancer_en_fond "$RACINE/frontend" "$JOURNAUX/frontend.log" npm start )"
  info "compilation et démarrage (journal : logs/frontend.log)…"
  set +e
  attendre_http "$ECRAN_URL" 180 "$FRONTEND_PID"
  resultat=$?
  set -e
  case $resultat in
    0) info "démarré — http://localhost:4200" ;;
    2) souci "l'écran s'est arrêté. Dernières lignes du journal :"
       tail -n 25 "$JOURNAUX/frontend.log"
       exit 1 ;;
    *) souci "l'écran n'a pas répondu en 3 minutes. Journal : logs/frontend.log"
       exit 1 ;;
  esac
fi

etape "Environnement prêt"
info "Base     : localhost:5433  (tickets / ticket_user / ticket_pass)"
info "API      : http://localhost:8080/api/tickets"
info "Swagger  : $SWAGGER_URL"
info "Écran    : $ECRAN_URL"
info "Journaux : logs/backend.log  logs/frontend.log"
info "Ctrl+C pour arrêter le backend et l'écran."

if [[ -n "$BACKEND_PID" || -n "$FRONTEND_PID" ]]; then
  wait
fi
