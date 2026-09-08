package com.ibizabroker.bibliotheque.controller;

import com.ibizabroker.bibliotheque.dto.ReservationRequestDTO;
import com.ibizabroker.bibliotheque.dto.ReservationResponseDTO;
import com.ibizabroker.bibliotheque.service.ReservationService;
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
    @PostMapping
    public ResponseEntity<ReservationResponseDTO> creerReservation(
            @Valid @RequestBody ReservationRequestDTO request) {
        ReservationResponseDTO response = reservationService.creerReservation(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // GET /api/reservations - Lister (filtrable)
    @GetMapping
    public ResponseEntity<List<ReservationResponseDTO>> getAllReservations(
            @RequestParam(required = false) String statut,
            @RequestParam(required = false) Integer adherentId) {
        List<ReservationResponseDTO> reservations = reservationService.getAllReservations(statut, adherentId);
        return ResponseEntity.ok(reservations);
    }

    // GET /api/reservations/{id} - Consulter
    @GetMapping("/{id}")
    public ResponseEntity<ReservationResponseDTO> getReservationById(@PathVariable Integer id) {
        ReservationResponseDTO response = reservationService.getReservationById(id);
        return ResponseEntity.ok(response);
    }

    // PATCH /api/reservations/{id}/annuler - Annuler
    @PatchMapping("/{id}/annuler")
    public ResponseEntity<ReservationResponseDTO> annulerReservation(@PathVariable Integer id) {
        ReservationResponseDTO response = reservationService.annulerReservation(id);
        return ResponseEntity.ok(response);
    }

    // DELETE /api/reservations/{id} - Supprimer
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
