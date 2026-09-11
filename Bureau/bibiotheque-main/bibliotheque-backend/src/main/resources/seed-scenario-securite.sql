-- Scénario de démonstration "sécurité du module réservation" (Séance 4)
-- Crée les rôles ADHERENT / BIBLIOTHECAIRE ainsi que deux comptes ADHERENT distincts
-- (ADH1, ADH2) et un compte BIBLIOTHECAIRE (BIB1), chacun des deux adhérents ayant au moins
-- une réservation à son nom (utile pour démontrer RS-03 et RS-05 en direct).
-- Idempotent : peut être rejoué sans dupliquer.
-- Ce script n'est PAS exécuté automatiquement (cf. application.properties) : à lancer
-- manuellement (ex. via psql) avant la présentation, comme seed-scenario-quota.sql.
--
-- Mot de passe pour les trois comptes : admin123
-- Hash BCrypt : $2a$10$/M/FsgGmSFAyNMoFZdiypuhdTYx5UoPq.EXt1UYRPsbsX6aoUPUhy

-- ==========================================
-- RÔLES
-- ==========================================
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM "role" WHERE role_name = 'ADHERENT') THEN
        INSERT INTO "role" (role_name) VALUES ('ADHERENT');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM "role" WHERE role_name = 'BIBLIOTHECAIRE') THEN
        INSERT INTO "role" (role_name) VALUES ('BIBLIOTHECAIRE');
    END IF;
END $$;

-- ==========================================
-- COMPTES DE DÉMONSTRATION
-- ==========================================
DO $$
DECLARE
    adherent_role_id INT;
    bibliothecaire_role_id INT;
BEGIN
    SELECT role_id INTO adherent_role_id FROM "role" WHERE role_name = 'ADHERENT';
    SELECT role_id INTO bibliothecaire_role_id FROM "role" WHERE role_name = 'BIBLIOTHECAIRE';

    -- ADH1 : premier adhérent
    IF NOT EXISTS (SELECT 1 FROM "users" WHERE username = 'ADH1') THEN
        INSERT INTO "users" (user_id, username, name, password)
        VALUES (nextval('hibernate_sequence'), 'ADH1', 'Adherent Un',
                '$2a$10$/M/FsgGmSFAyNMoFZdiypuhdTYx5UoPq.EXt1UYRPsbsX6aoUPUhy');
        INSERT INTO user_role (user_id, role_id)
        SELECT user_id, adherent_role_id FROM "users" WHERE username = 'ADH1';
    END IF;

    -- ADH2 : second adhérent, distinct du premier
    IF NOT EXISTS (SELECT 1 FROM "users" WHERE username = 'ADH2') THEN
        INSERT INTO "users" (user_id, username, name, password)
        VALUES (nextval('hibernate_sequence'), 'ADH2', 'Adherent Deux',
                '$2a$10$/M/FsgGmSFAyNMoFZdiypuhdTYx5UoPq.EXt1UYRPsbsX6aoUPUhy');
        INSERT INTO user_role (user_id, role_id)
        SELECT user_id, adherent_role_id FROM "users" WHERE username = 'ADH2';
    END IF;

    -- BIB1 : bibliothécaire
    IF NOT EXISTS (SELECT 1 FROM "users" WHERE username = 'BIB1') THEN
        INSERT INTO "users" (user_id, username, name, password)
        VALUES (nextval('hibernate_sequence'), 'BIB1', 'Bibliothecaire Un',
                '$2a$10$/M/FsgGmSFAyNMoFZdiypuhdTYx5UoPq.EXt1UYRPsbsX6aoUPUhy');
        INSERT INTO user_role (user_id, role_id)
        SELECT user_id, bibliothecaire_role_id FROM "users" WHERE username = 'BIB1';
    END IF;
END $$;

-- ==========================================
-- LIVRE INDISPONIBLE (RG-01 : une réservation n'est possible que si no_of_copies = 0)
-- ==========================================
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM "Books" WHERE book_name = 'L-SECURITE - Livre pour démo sécurité') THEN
        INSERT INTO "Books" (book_name, book_author, book_genre, no_of_copies)
        VALUES ('L-SECURITE - Livre pour démo sécurité', 'Auteur Démo', 'Roman', 0);
    END IF;
END $$;

-- ==========================================
-- UNE RÉSERVATION PAR ADHÉRENT (pour tester RS-03 / RS-05 en direct)
-- ==========================================
DO $$
DECLARE
    adh1_id INT;
    adh2_id INT;
    livre_id INT;
BEGIN
    SELECT user_id INTO adh1_id FROM "users" WHERE username = 'ADH1';
    SELECT user_id INTO adh2_id FROM "users" WHERE username = 'ADH2';
    SELECT book_id INTO livre_id FROM "Books" WHERE book_name = 'L-SECURITE - Livre pour démo sécurité';

    IF NOT EXISTS (SELECT 1 FROM "reservation" WHERE user_id = adh1_id AND book_id = livre_id) THEN
        INSERT INTO "reservation" (book_id, user_id, date_reservation, date_expiration, statut)
        VALUES (livre_id, adh1_id, NOW(), NOW() + INTERVAL '7 days', 'EN_ATTENTE');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM "reservation" WHERE user_id = adh2_id AND book_id = livre_id) THEN
        INSERT INTO "reservation" (book_id, user_id, date_reservation, date_expiration, statut)
        VALUES (livre_id, adh2_id, NOW(), NOW() + INTERVAL '7 days', 'EN_ATTENTE');
    END IF;
END $$;
