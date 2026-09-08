package com.ibizabroker.bibliotheque.controller;

import com.ibizabroker.bibliotheque.dto.ReservationRequestDTO;
import com.ibizabroker.bibliotheque.dto.ReservationResponseDTO;
import com.ibizabroker.bibliotheque.service.ReservationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/reservations")
@RequiredArgsConstructor
public class ReservationController {

    private final ReservationService reservationService;

    // POST /api/reservations - Créer une réservation
    @Operation(summary = "Créer une réservation")
    @ApiResponses({
        @ApiResponse(responseCode = "201", description = "Réservation créée"),
        @ApiResponse(responseCode = "400", description = "livreId ou adherentId manquant"),
        @ApiResponse(responseCode = "404", description = "Livre ou adhérent introuvable"),
        @ApiResponse(responseCode = "409", description = "Règle de gestion violée (RG-01, RG-02 ou RG-03)")
    })
    @PostMapping
    public ResponseEntity<ReservationResponseDTO> creerReservation(
            @Valid @RequestBody ReservationRequestDTO request) {
        ReservationResponseDTO response = reservationService.creerReservation(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // GET /api/reservations - Lister (filtrable)
    @Operation(summary = "Lister les réservations, filtrable par statut et par adhérent")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Liste des réservations")
    })
    @GetMapping
    public ResponseEntity<List<ReservationResponseDTO>> getAllReservations(
            @RequestParam(required = false) String statut,
            @RequestParam(required = false) Integer adherentId) {
        List<ReservationResponseDTO> reservations = reservationService.getAllReservations(statut, adherentId);
        return ResponseEntity.ok(reservations);
    }

    // GET /api/reservations/{id} - Consulter
    @Operation(summary = "Consulter une réservation")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Réservation trouvée"),
        @ApiResponse(responseCode = "404", description = "Réservation introuvable")
    })
    @GetMapping("/{id}")
    public ResponseEntity<ReservationResponseDTO> getReservationById(@PathVariable Integer id) {
        ReservationResponseDTO response = reservationService.getReservationById(id);
        return ResponseEntity.ok(response);
    }

    // PATCH /api/reservations/{id}/annuler - Annuler
    @Operation(summary = "Annuler une réservation")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Réservation annulée"),
        @ApiResponse(responseCode = "404", description = "Réservation introuvable"),
        @ApiResponse(responseCode = "409", description = "Règle de gestion violée (RG-05)")
    })
    @PatchMapping("/{id}/annuler")
    public ResponseEntity<ReservationResponseDTO> annulerReservation(@PathVariable Integer id) {
        ReservationResponseDTO response = reservationService.annulerReservation(id);
        return ResponseEntity.ok(response);
    }

    // DELETE /api/reservations/{id} - Supprimer
    @Operation(summary = "Supprimer une réservation")
    @ApiResponses({
        @ApiResponse(responseCode = "204", description = "Réservation supprimée"),
        @ApiResponse(responseCode = "404", description = "Réservation introuvable")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> supprimerReservation(@PathVariable Integer id) {
        reservationService.supprimerReservation(id);
        return ResponseEntity.noContent().build();
    }

    // Endpoint bonus : réservations expirées
    @PatchMapping("/traiter-expirees")
    public ResponseEntity<Void> traiterExpirees() {
        reservationService.traiterReservationsExpirees();
        return ResponseEntity.ok().build();
    }

    // Honorer une réservation : l'utilisateur vient chercher le livre réservé
    @PatchMapping("/{id}/honorer")
    public ResponseEntity<ReservationResponseDTO> honorerReservation(@PathVariable Integer id) {
        ReservationResponseDTO response = reservationService.honorerReservation(id);
        return ResponseEntity.ok(response);
    }
}
