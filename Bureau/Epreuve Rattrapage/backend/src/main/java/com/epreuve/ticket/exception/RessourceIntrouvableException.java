package com.epreuve.ticket.exception;

/**
 * Leve quand un identifiant inconnu est demande. Mappee en 404.
 */
public class RessourceIntrouvableException extends RuntimeException {

    public RessourceIntrouvableException(String message) {
        super(message);
    }
}
