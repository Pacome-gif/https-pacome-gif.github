package com.epreuve.ticket.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Charge utile d'erreur : elle nomme la regle violee, jamais un simple
 * "erreur serveur".
 */
@Schema(name = "MessageErreur", description = "Description lisible d'un refus")
public class MessageErreur {

    @Schema(description = "Code HTTP", example = "409")
    private int code;

    @Schema(description = "Regle de gestion violee", example = "RG-02")
    private String regle;

    @Schema(description = "Message lisible", example = "RG-02 : un ticket avec ce titre existe deja.")
    private String message;

    @Schema(description = "Detail des erreurs de validation, champ par champ (400 uniquement)")
    private List<String> details;

    @Schema(description = "Horodatage de l'erreur")
    private LocalDateTime horodatage;

    public MessageErreur(int code, String regle, String message, List<String> details) {
        this.code = code;
        this.regle = regle;
        this.message = message;
        this.details = details;
        this.horodatage = LocalDateTime.now();
    }

    public int getCode() {
        return code;
    }

    public String getRegle() {
        return regle;
    }

    public String getMessage() {
        return message;
    }

    public List<String> getDetails() {
        return details;
    }

    public LocalDateTime getHorodatage() {
        return horodatage;
    }
}
