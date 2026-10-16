package com.epreuve.ticket.service;

import com.epreuve.ticket.domain.StatutTicket;
import com.epreuve.ticket.domain.Ticket;
import com.epreuve.ticket.dto.TicketCreationRequest;
import com.epreuve.ticket.dto.TicketReponse;
import com.epreuve.ticket.exception.RegleMetierException;
import com.epreuve.ticket.exception.RessourceIntrouvableException;
import com.epreuve.ticket.repository.TicketRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Toute la logique metier est ici. Le controleur ne fait que traduire HTTP -> service.
 * L'entite Ticket ne sort jamais de cette couche : on renvoie des TicketReponse.
 */
@Service
public class TicketService {

    private final TicketRepository ticketRepository;

    public TicketService(TicketRepository ticketRepository) {
        this.ticketRepository = ticketRepository;
    }

    /**
     * RG-01 : titre obligatoire, 100 caracteres max, statut initial OUVERT.
     * RG-02 : deux tickets ne peuvent pas avoir le meme titre.
     * La date est generee par le serveur (voir Ticket#avantPersistance).
     */
    @Transactional
    public TicketReponse creer(TicketCreationRequest requete) {
        String titre = requete.getTitre() == null ? null : requete.getTitre().trim();

        if (titre == null || titre.isEmpty()) {
            throw new RegleMetierException("RG-01", "RG-01 : le titre est obligatoire.");
        }
        if (titre.length() > 100) {
            throw new RegleMetierException("RG-01", "RG-01 : le titre ne peut pas dépasser 100 caractères.");
        }
        if (ticketRepository.existsByTitreIgnoreCase(titre)) {
            throw new RegleMetierException("RG-02", "RG-02 : un ticket avec ce titre existe déjà.");
        }

        Ticket ticket = new Ticket(titre, requete.getDescription());
        Ticket enregistre = ticketRepository.save(ticket);
        return versReponse(enregistre);
    }

    /** Liste tous les tickets, ou seulement ceux d'un statut donne. */
    @Transactional(readOnly = true)
    public List<TicketReponse> lister(StatutTicket statut) {
        List<Ticket> tickets = (statut == null)
                ? ticketRepository.findAllByOrderByDateCreationDesc()
                : ticketRepository.findByStatutOrderByDateCreationDesc(statut);

        return tickets.stream().map(TicketService::versReponse).toList();
    }

    /**
     * RG-03 : un ticket ne peut etre ferme que s'il est OUVERT ou EN_COURS.
     * Un ticket deja FERME ne change plus d'etat -> 409.
     */
    @Transactional
    public TicketReponse fermer(Long id) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new RessourceIntrouvableException(
                        "Aucun ticket ne correspond à l'identifiant " + id + "."));

        if (ticket.getStatut() == StatutTicket.FERME) {
            throw new RegleMetierException("RG-03",
                    "RG-03 : le ticket est déjà fermé et ne peut plus changer d'état.");
        }

        ticket.setStatut(StatutTicket.FERME);
        return versReponse(ticket);
    }

    private static TicketReponse versReponse(Ticket ticket) {
        return new TicketReponse(
                ticket.getId(),
                ticket.getTitre(),
                ticket.getDescription(),
                ticket.getStatut(),
                ticket.getDateCreation());
    }
}
