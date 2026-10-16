package com.epreuve.ticket.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * DTO en entree de la creation (POST /api/tickets).
 * Le client n'envoie QUE le titre et la description : le statut et la date
 * sont determines par le serveur.
 */
@Schema(name = "TicketCreationRequest", description = "Donnees envoyees par le client pour creer un ticket")
public class TicketCreationRequest {

    @NotBlank(message = "RG-01 : le titre est obligatoire.")
    @Size(max = 100, message = "RG-01 : le titre ne peut pas dépasser 100 caractères.")
    @Schema(description = "Titre du ticket", example = "Imprimante hors service", maxLength = 100)
    private String titre;

    @Size(max = 1000, message = "RG-01 : la description ne peut pas dépasser 1000 caractères.")
    @Schema(description = "Description facultative du ticket", example = "L'imprimante du 2e etage ne repond plus.")
    private String description;

    public String getTitre() {
        return titre;
    }

    public void setTitre(String titre) {
        this.titre = titre;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
