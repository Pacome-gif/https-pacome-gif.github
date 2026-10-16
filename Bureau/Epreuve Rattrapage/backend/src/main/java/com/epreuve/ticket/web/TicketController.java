package com.epreuve.ticket.web;

import com.epreuve.ticket.domain.StatutTicket;
import com.epreuve.ticket.dto.MessageErreur;
import com.epreuve.ticket.dto.TicketCreationRequest;
import com.epreuve.ticket.dto.TicketReponse;
import com.epreuve.ticket.service.TicketService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Couche HTTP uniquement : elle delegue toute la logique au service.
 */
@RestController
@RequestMapping("/api/tickets")
@Tag(name = "Tickets", description = "Gestion des tickets de support")
public class TicketController {

    private final TicketService ticketService;

    public TicketController(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    @PostMapping
    @Operation(summary = "Creer un ticket",
            description = "Le client n'envoie que le titre et la description. "
                    + "Le statut (OUVERT) et la date sont determines par le serveur (RG-01).")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Ticket cree",
                    content = @Content(schema = @Schema(implementation = TicketReponse.class))),
            @ApiResponse(responseCode = "400", description = "Titre absent ou depassant 100 caracteres (RG-01)",
                    content = @Content(schema = @Schema(implementation = MessageErreur.class))),
            @ApiResponse(responseCode = "409", description = "Un ticket avec ce titre existe deja (RG-02)",
                    content = @Content(schema = @Schema(implementation = MessageErreur.class)))
    })
    public ResponseEntity<TicketReponse> creer(@Valid @RequestBody TicketCreationRequest requete) {
        TicketReponse cree = ticketService.creer(requete);
        return ResponseEntity.status(HttpStatus.CREATED).body(cree);
    }

    @GetMapping
    @Operation(summary = "Lister les tickets",
            description = "Liste tous les tickets, ou seulement ceux d'un statut donne.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Liste des tickets",
                    content = @Content(schema = @Schema(implementation = TicketReponse.class)))
    })
    public ResponseEntity<List<TicketReponse>> lister(
            @RequestParam(name = "statut", required = false) StatutTicket statut) {
        return ResponseEntity.ok(ticketService.lister(statut));
    }

    @PatchMapping("/{id}/fermer")
    @Operation(summary = "Fermer un ticket",
            description = "Un ticket ne peut etre ferme que s'il est OUVERT ou EN_COURS (RG-03).")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Ticket ferme",
                    content = @Content(schema = @Schema(implementation = TicketReponse.class))),
            @ApiResponse(responseCode = "404", description = "Identifiant inconnu",
                    content = @Content(schema = @Schema(implementation = MessageErreur.class))),
            @ApiResponse(responseCode = "409", description = "Le ticket est deja FERME (RG-03)",
                    content = @Content(schema = @Schema(implementation = MessageErreur.class)))
    })
    public ResponseEntity<TicketReponse> fermer(@PathVariable("id") Long id) {
        return ResponseEntity.ok(ticketService.fermer(id));
    }
}
