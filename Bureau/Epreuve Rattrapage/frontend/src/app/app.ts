import { Component, OnInit, computed, inject, signal, viewChild } from '@angular/core';
import { finalize } from 'rxjs';

import { TicketListComponent } from './components/ticket-list/ticket-list';
import { TicketFormComponent } from './components/ticket-form/ticket-form';
import {
  FiltreStatut,
  StatutTicket,
  Ticket,
  TicketCreationRequest,
  TriDate,
} from './models/ticket.model';
import { ErreurApi } from './services/erreur-api';
import { TicketService } from './services/ticket.service';

/**
 * Nombre de tickets par page. Le tri et la pagination se font sur l'ecran : les
 * trois endpoints de l'enonce restent tels quels.
 */
const TAILLE_PAGE = 5;

/**
 * Conteneur : il detient l'etat et declenche les appels au service.
 * Les composants liste et formulaire restent purement presentatifs.
 */
@Component({
  selector: 'app-root',
  imports: [TicketListComponent, TicketFormComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  private readonly ticketService = inject(TicketService);
  private readonly formulaire = viewChild(TicketFormComponent);

  readonly tickets = signal<Ticket[]>([]);
  readonly chargement = signal(true);
  readonly erreurChargement = signal<string | null>(null);
  readonly filtre = signal<FiltreStatut>('TOUS');

  readonly creationEnCours = signal(false);
  readonly erreurFormulaire = signal<string | null>(null);
  readonly messageAction = signal<string | null>(null);

  /** Bonus : tri par date de creation et pagination de la liste. */
  readonly triDate = signal<TriDate>('recent');
  readonly page = signal(1);

  /** Apres une creation, on se replace sur la page ou le ticket apparait. */
  private revenirSurNouveau = false;

  /** Bonus : compteur de tickets ouverts parmi les tickets affiches. */
  readonly nbOuverts = computed(
    () => this.tickets().filter((ticket) => ticket.statut === 'OUVERT').length,
  );

  /** Tickets tries par date de creation, dans le sens choisi. */
  readonly ticketsTries = computed(() => {
    const ordre = this.triDate() === 'recent' ? -1 : 1;
    return [...this.tickets()].sort(
      (premier, second) => ordre * premier.dateCreation.localeCompare(second.dateCreation),
    );
  });

  readonly nbPages = computed(() => Math.max(1, Math.ceil(this.tickets().length / TAILLE_PAGE)));

  /** La tranche de tickets reellement affichee sur la page courante. */
  readonly ticketsPage = computed(() => {
    const debut = (this.page() - 1) * TAILLE_PAGE;
    return this.ticketsTries().slice(debut, debut + TAILLE_PAGE);
  });

  readonly premierAffiche = computed(() =>
    this.ticketsPage().length === 0 ? 0 : (this.page() - 1) * TAILLE_PAGE + 1,
  );

  readonly dernierAffiche = computed(
    () => (this.page() - 1) * TAILLE_PAGE + this.ticketsPage().length,
  );

  ngOnInit(): void {
    this.charger();
  }

  /** Charge la liste, avec le filtre courant. */
  charger(): void {
    this.chargement.set(true);
    this.erreurChargement.set(null);

    this.ticketService
      .lister(this.statutFiltre())
      .pipe(finalize(() => this.chargement.set(false)))
      .subscribe({
        next: (tickets) => {
          this.tickets.set(tickets);
          // La liste a pu raccourcir : on ne reste pas bloque sur une page vide.
          this.page.update((page) => Math.min(page, this.nbPages()));
          if (this.revenirSurNouveau) {
            this.revenirSurNouveau = false;
            this.page.set(this.triDate() === 'recent' ? 1 : this.nbPages());
          }
        },
        error: (erreur: ErreurApi) => this.erreurChargement.set(erreur.message),
      });
  }

  changerFiltre(filtre: FiltreStatut): void {
    this.filtre.set(filtre);
    // Autre liste : on repart de la premiere page.
    this.page.set(1);
    this.charger();
  }

  /** Change le sens du tri par date de creation et revient a la premiere page. */
  changerTri(tri: TriDate): void {
    this.triDate.set(tri);
    this.page.set(1);
  }

  pagePrecedente(): void {
    this.page.update((page) => Math.max(1, page - 1));
  }

  pageSuivante(): void {
    this.page.update((page) => Math.min(this.nbPages(), page + 1));
  }

  /** Cree un ticket, puis rafraichit la liste sans recharger la page. */
  creerTicket(requete: TicketCreationRequest): void {
    this.creationEnCours.set(true);
    this.erreurFormulaire.set(null);
    this.messageAction.set(null);

    this.ticketService
      .creer(requete)
      .pipe(finalize(() => this.creationEnCours.set(false)))
      .subscribe({
        next: () => {
          this.formulaire()?.reinitialiser();
          this.revenirSurNouveau = true;
          this.charger();
        },
        // 400 (RG-01) ou 409 (RG-02) : le message du serveur s'affiche tel quel.
        error: (erreur: ErreurApi) => this.erreurFormulaire.set(erreur.message),
      });
  }

  /** Demande confirmation, puis ferme le ticket via PATCH. */
  fermerTicket(id: number): void {
    const ticket = this.tickets().find((candidat) => candidat.id === id);
    const libelle = ticket ? `« ${ticket.titre} »` : `n° ${id}`;

    if (!window.confirm(`Confirmer la fermeture du ticket ${libelle} ?`)) {
      return;
    }

    this.messageAction.set(null);

    this.ticketService.fermer(id).subscribe({
      next: (misAJour) => {
        // Le statut se met a jour dans la liste, sans rechargement de la page.
        this.tickets.update((tickets) =>
          tickets.map((candidat) => (candidat.id === misAJour.id ? misAJour : candidat)),
        );
        // Si un filtre masque desormais ce ticket, on recharge pour rester coherent.
        if (this.statutFiltre() !== null) {
          this.charger();
        }
      },
      // 409 (RG-03) : le message du serveur s'affiche.
      error: (erreur: ErreurApi) => this.messageAction.set(erreur.message),
    });
  }

  private statutFiltre(): StatutTicket | null {
    const filtre = this.filtre();
    return filtre === 'TOUS' ? null : filtre;
  }
}
