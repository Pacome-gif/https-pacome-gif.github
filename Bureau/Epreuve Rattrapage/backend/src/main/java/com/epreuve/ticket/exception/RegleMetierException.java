package com.epreuve.ticket.exception;

/**
 * Leve quand une regle de gestion est violee. Mappee en 409.
 * Le message nomme toujours la regle (RG-02, RG-03) : jamais "erreur serveur".
 */
public class RegleMetierException extends RuntimeException {

    private final String regle;

    public RegleMetierException(String regle, String message) {
        super(message);
        this.regle = regle;
    }

    public String getRegle() {
        return regle;
    }
}
