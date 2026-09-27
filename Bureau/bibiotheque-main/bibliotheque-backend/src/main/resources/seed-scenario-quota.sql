-- Scénario de démonstration "quota de réservation" (séances 3 et 4).
-- Ce script VIDE la base (TRUNCATE) puis la reconstruit intégralement dans l'état suivant :
--
--   L1             -> disponible, aucun emprunt en cours
--   L2, L3, L4, L5 -> tous empruntés et non rendus (détenus par A3)
--   A1             -> réservataire principal (ADHERENT, aucune réservation active au départ)
--   A2             -> ADHERENT, a déjà 3 réservations actives (EN_ATTENTE) sur L2, L3, L4
--                     -> quota saturé (RG-03)
--   A3             -> ADHERENT, l'emprunteur, détient L2 à L5 (emprunts non rendus)
--   BIB1           -> BIBLIOTHECAIRE, pour tester la partie sécurité (séance 4, RS-01 à RS-05)
--
-- Mot de passe pour les quatre comptes : admin123
-- Hash BCrypt : $2a$10$/M/FsgGmSFAyNMoFZdiypuhdTYx5UoPq.EXt1UYRPsbsX6aoUPUhy
--
-- Ce script n'est PAS exécuté automatiquement (cf. application.properties) : à lancer
-- manuellement (ex. via psql) avant la présentation. Non idempotent par design (TRUNCATE) :
-- le rejouer remet toujours la base dans cet état exact.

BEGIN;

TRUNCATE TABLE reservation, borrow, user_role, users, books, role RESTART IDENTITY CASCADE;
ALTER SEQUENCE hibernate_sequence RESTART WITH 1;

-- ==========================================
-- RÔLES
-- ==========================================
INSERT INTO role (role_name) VALUES ('ADHERENT');
INSERT INTO role (role_name) VALUES ('BIBLIOTHECAIRE');

-- ==========================================
-- UTILISATEURS
-- ==========================================
INSERT INTO users (user_id, username, name, password) VALUES
    (nextval('hibernate_sequence'), 'A1', 'A1 - Réservataire principal', '$2a$10$/M/FsgGmSFAyNMoFZdiypuhdTYx5UoPq.EXt1UYRPsbsX6aoUPUhy'),
    (nextval('hibernate_sequence'), 'A2', 'A2 - Quota saturé',           '$2a$10$/M/FsgGmSFAyNMoFZdiypuhdTYx5UoPq.EXt1UYRPsbsX6aoUPUhy'),
    (nextval('hibernate_sequence'), 'A3', 'A3 - Emprunteur',             '$2a$10$/M/FsgGmSFAyNMoFZdiypuhdTYx5UoPq.EXt1UYRPsbsX6aoUPUhy'),
    (nextval('hibernate_sequence'), 'BIB1', 'Bibliothecaire Un',         '$2a$10$/M/FsgGmSFAyNMoFZdiypuhdTYx5UoPq.EXt1UYRPsbsX6aoUPUhy');

INSERT INTO user_role (user_id, role_id)
SELECT u.user_id, r.role_id FROM users u, role r WHERE u.username IN ('A1', 'A2', 'A3') AND r.role_name = 'ADHERENT';

INSERT INTO user_role (user_id, role_id)
SELECT u.user_id, r.role_id FROM users u, role r WHERE u.username = 'BIB1' AND r.role_name = 'BIBLIOTHECAIRE';

-- ==========================================
-- LIVRES
-- ==========================================
-- L1 : disponible, aucun emprunt en cours
INSERT INTO books (book_id, book_name, book_author, book_genre, no_of_copies) VALUES
    (nextval('hibernate_sequence'), 'L1 - Le Petit Prince', 'Antoine de Saint-Exupéry', 'Conte', 3);

-- L2 à L5 : tous empruntés et non rendus (no_of_copies = 0)
INSERT INTO books (book_id, book_name, book_author, book_genre, no_of_copies) VALUES
    (nextval('hibernate_sequence'), 'L2 - L''Étranger',         'Albert Camus',      'Roman', 0),
    (nextval('hibernate_sequence'), 'L3 - Les Misérables',      'Victor Hugo',       'Roman', 0),
    (nextval('hibernate_sequence'), 'L4 - Le Rouge et le Noir', 'Stendhal',          'Roman', 0),
    (nextval('hibernate_sequence'), 'L5 - Madame Bovary',       'Gustave Flaubert',  'Roman', 0);

-- ==========================================
-- EMPRUNTS : A3 détient L2, L3, L4, L5 (non rendus)
-- ==========================================
INSERT INTO borrow (book_id, user_id, issue_date, due_date, return_date)
SELECT b.book_id, u.user_id, NOW(), NOW() + INTERVAL '7 days', NULL
FROM books b, users u
WHERE u.username = 'A3'
  AND b.book_name IN ('L2 - L''Étranger', 'L3 - Les Misérables', 'L4 - Le Rouge et le Noir', 'L5 - Madame Bovary');

-- ==========================================
-- RÉSERVATIONS : A2 a déjà 3 réservations actives (quota saturé, RG-03)
-- ==========================================
INSERT INTO reservation (book_id, user_id, date_reservation, date_expiration, statut)
SELECT b.book_id, u.user_id, NOW(), NOW() + INTERVAL '7 days', 'EN_ATTENTE'
FROM books b, users u
WHERE u.username = 'A2'
  AND b.book_name IN ('L2 - L''Étranger', 'L3 - Les Misérables', 'L4 - Le Rouge et le Noir');

COMMIT;
