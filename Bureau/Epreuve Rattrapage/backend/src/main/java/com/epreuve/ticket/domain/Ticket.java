package com.epreuve.ticket.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

import java.time.LocalDateTime;

/**
 * Entite Ticket. Elle ne sort jamais du service : le controleur manipule des DTO.
 */
@Entity
@Table(
        name = "ticket",
        // RG-02 : deux tickets ne peuvent pas avoir le meme titre.
        uniqueConstraints = @UniqueConstraint(name = "uk_ticket_titre", columnNames = "titre")
)
public class Ticket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // RG-01 : titre obligatoire, 100 caracteres maximum.
    @Column(name = "titre", nullable = false, length = 100)
    private String titre;

    @Column(name = "description", length = 1000)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "statut", nullable = false, length = 20)
    private StatutTicket statut;

    // RG-01 : date generee par le serveur, jamais fournie par le client.
    @Column(name = "date_creation", nullable = false, updatable = false)
    private LocalDateTime dateCreation;

    protected Ticket() {
        // requis par JPA
    }

    public Ticket(String titre, String description) {
        this.titre = titre;
        this.description = description;
        // RG-01 : un ticket est cree avec le statut OUVERT.
        this.statut = StatutTicket.OUVERT;
    }

    @PrePersist
    void avantPersistance() {
        if (this.dateCreation == null) {
            this.dateCreation = LocalDateTime.now();
        }
        if (this.statut == null) {
            this.statut = StatutTicket.OUVERT;
        }
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

    public void setStatut(StatutTicket statut) {
        this.statut = statut;
    }

    public LocalDateTime getDateCreation() {
        return dateCreation;
    }
}
