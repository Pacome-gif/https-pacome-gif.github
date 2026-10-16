package com.epreuve.ticket.dto;

import com.epreuve.ticket.domain.StatutTicket;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;

/**
 * DTO en sortie : l'entite Ticket ne sort jamais du service.
 */
@Schema(name = "TicketReponse", description = "Ticket renvoye par l'API")
public class TicketReponse {

    @Schema(description = "Identifiant du ticket", example = "1")
    private Long id;

    @Schema(description = "Titre du ticket", example = "Imprimante hors service")
    private String titre;

    @Schema(description = "Description du ticket", example = "L'imprimante du 2e etage ne repond plus.")
    private String description;

    @Schema(description = "Statut du ticket", example = "OUVERT")
    private StatutTicket statut;

    @Schema(description = "Date de creation generee par le serveur", example = "2026-10-16T10:15:30")
    private LocalDateTime dateCreation;

    public TicketReponse() {
    }

    public TicketReponse(Long id, String titre, String description, StatutTicket statut, LocalDateTime dateCreation) {
        this.id = id;
        this.titre = titre;
        this.description = description;
        this.statut = statut;
        this.dateCreation = dateCreation;
    }

    public Long getId() {
        return id;
    }

    public String getTitre() {
        return titre;
    }

    public String getDescription() {
        return description;
    }

    public StatutTicket getStatut() {
        return statut;
    }

    public LocalDateTime getDateCreation() {
        return dateCreation;
    }
}
