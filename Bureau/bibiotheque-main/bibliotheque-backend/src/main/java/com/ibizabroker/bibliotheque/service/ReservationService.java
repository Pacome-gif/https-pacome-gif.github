package com.ibizabroker.bibliotheque.service;

import com.ibizabroker.bibliotheque.dao.BooksRepository;
import com.ibizabroker.bibliotheque.dao.ReservationRepository;
import com.ibizabroker.bibliotheque.dao.UsersRepository;
import com.ibizabroker.bibliotheque.dto.ReservationRequestDTO;
import com.ibizabroker.bibliotheque.dto.ReservationResponseDTO;
import com.ibizabroker.bibliotheque.entity.Books;
import com.ibizabroker.bibliotheque.entity.Reservation;
import com.ibizabroker.bibliotheque.entity.ReservationStatus;
import com.ibizabroker.bibliotheque.entity.Users;
import com.ibizabroker.bibliotheque.exceptions.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final BooksRepository booksRepository;
    private final UsersRepository usersRepository;

    private static final int MAX_RESERVATIONS_ACTIVES = 3;
    private static final int DELAI_EXPIRATION_JOURS = 7;

    // CRÉER UNE RÉSERVATION
    @Transactional
    public ReservationResponseDTO creerReservation(ReservationRequestDTO request) {
        // Vérifier que le livre existe
        Books book = booksRepository.findById(request.getLivreId())
            .orElseThrow(() -> new NotFoundException("Livre non trouvé avec l'ID : " + request.getLivreId()));

        // Vérifier que l'utilisateur existe
        Users user = usersRepository.findById(request.getAdherentId())
            .orElseThrow(() -> new NotFoundException("Utilisateur non trouvé avec l'ID : " + request.getAdherentId()));

        // RG-01 : On ne peut réserver qu'un livre indisponible
        if (book.getNoOfCopies() > 0) {
            throw new IllegalStateException("RG-01 : Le livre est disponible, la réservation est refusée.");
        }

        // RG-02 : Un adhérent ne peut avoir qu'une seule réservation active sur un même livre
        List<ReservationStatus> statutsActifs = Arrays.asList(
            ReservationStatus.EN_ATTENTE, 
            ReservationStatus.DISPONIBLE
        );
        boolean reservationExistante = reservationRepository
            .findByUserAndBookAndStatutIn(user, book, statutsActifs)
            .isPresent();
        if (reservationExistante) {
            throw new IllegalStateException("RG-02 : Vous avez déjà une réservation active sur ce livre.");
        }

        // RG-03 : Un adhérent ne peut pas dépasser 3 réservations actives
        long nbReservationsActives = reservationRepository.countByUserAndStatutIn(user, statutsActifs);
        if (nbReservationsActives >= MAX_RESERVATIONS_ACTIVES) {
            throw new IllegalStateException("RG-03 : Vous avez déjà " + nbReservationsActives + 
                " réservations actives (maximum 3).");
        }

        // Créer la réservation
        Reservation reservation = new Reservation();
        reservation.setBook(book);
        reservation.setUser(user);
        reservation.setDateReservation(LocalDateTime.now());
        // RG-04 : dateExpiration = dateReservation + 7 jours
        reservation.setDateExpiration(LocalDateTime.now().plusDays(DELAI_EXPIRATION_JOURS));
        reservation.setStatut(ReservationStatus.EN_ATTENTE);

        Reservation saved = reservationRepository.save(reservation);
        return toResponseDTO(saved);
    }

    // CONSULTER UNE RÉSERVATION PAR ID
    public ReservationResponseDTO getReservationById(Integer id) {
        Reservation reservation = reservationRepository.findById(id)
            .orElseThrow(() -> new NotFoundException("Réservation non trouvée avec l'ID : " + id));
        return toResponseDTO(reservation);
    }

    // LISTER TOUTES LES RÉSERVATIONS (avec filtres optionnels) - VERSION CORRIGÉE
    public List<ReservationResponseDTO> getAllReservations(String statut, Integer adherentId) {
        List<Reservation> reservations;

        if (statut != null && adherentId != null) {
            // Filtrer par statut ET adhérent
            Users user = usersRepository.findById(adherentId)
                .orElseThrow(() -> new NotFoundException("Utilisateur non trouvé"));
            ReservationStatus statusEnum = ReservationStatus.valueOf(statut.toUpperCase());
            // Récupérer toutes les réservations de l'utilisateur puis filtrer par statut
            reservations = reservationRepository.findByUser(user)
                .stream()
                .filter(r -> r.getStatut() == statusEnum)
                .collect(Collectors.toList());
        } else if (statut != null) {
            // Filtrer par statut uniquement
            ReservationStatus statusEnum = ReservationStatus.valueOf(statut.toUpperCase());
            reservations = reservationRepository.findByStatut(statusEnum);
        } else if (adherentId != null) {
            // Filtrer par adhérent uniquement
            Users user = usersRepository.findById(adherentId)
                .orElseThrow(() -> new NotFoundException("Utilisateur non trouvé"));
            reservations = reservationRepository.findByUser(user);
        } else {
            // Tout lister
            reservations = reservationRepository.findAll();
        }

        return reservations.stream()
            .map(this::toResponseDTO)
            .collect(Collectors.toList());
    }

    // ANNULER UNE RÉSERVATION
    @Transactional
    public ReservationResponseDTO annulerReservation(Integer id) {
        Reservation reservation = reservationRepository.findById(id)
            .orElseThrow(() -> new NotFoundException("Réservation non trouvée avec l'ID : " + id));

        // RG-05 : Une réservation ne peut être annulée que si son statut est EN_ATTENTE ou DISPONIBLE
        if (reservation.getStatut() != ReservationStatus.EN_ATTENTE && 
            reservation.getStatut() != ReservationStatus.DISPONIBLE) {
            throw new IllegalStateException("RG-05 : Seules les réservations en attente ou disponibles peuvent être annulées.");
        }

        // RG-06 : Une réservation ANNULEE, EXPIREE ou HONOREE ne peut plus changer d'état
        reservation.setStatut(ReservationStatus.ANNULEE);
        Reservation updated = reservationRepository.save(reservation);
        return toResponseDTO(updated);
    }

    // SUPPRIMER UNE RÉSERVATION
    @Transactional
    public void supprimerReservation(Integer id) {
        Reservation reservation = reservationRepository.findById(id)
            .orElseThrow(() -> new NotFoundException("Réservation non trouvée avec l'ID : " + id));
        reservationRepository.delete(reservation);
    }

    // MÉTHODE UTILE : Convertir entité → DTO
    private ReservationResponseDTO toResponseDTO(Reservation reservation) {
        ReservationResponseDTO dto = new ReservationResponseDTO();
        dto.setId(reservation.getId());
        dto.setLivreId(reservation.getBook().getBookId());
        dto.setLivreNom(reservation.getBook().getBookName());
        dto.setAdherentId(reservation.getUser().getUserId());
        dto.setAdherentNom(reservation.getUser().getName());
        dto.setDateReservation(reservation.getDateReservation());
        dto.setDateExpiration(reservation.getDateExpiration());
        dto.setStatut(reservation.getStatut());
        return dto;
    }

    // MÉTHODE BONUS : Traitement des réservations expirées (pour le bonus)
    @Transactional
    public void traiterReservationsExpirees() {
        List<Reservation> expirees = reservationRepository.findByStatutAndDateExpirationBefore(
            ReservationStatus.EN_ATTENTE, 
            LocalDateTime.now()
        );
        for (Reservation r : expirees) {
            r.setStatut(ReservationStatus.EXPIREE);
            reservationRepository.save(r);
        }
    }

    // NOTIFICATION : Quand un livre est rendu, vérifier les réservations en attente
    @Transactional
    public ReservationResponseDTO notifierLivreDisponible(Integer bookId) {
        // Trouver le livre
        Books book = booksRepository.findById(bookId)
            .orElseThrow(() -> new NotFoundException("Livre non trouvé avec l'ID : " + bookId));

        // Chercher les réservations EN_ATTENTE pour ce livre
        List<Reservation> reservations = reservationRepository.findByBook(book);
        
        // Trouver la première réservation EN_ATTENTE
        Reservation reservationEnAttente = reservations.stream()
            .filter(r -> r.getStatut() == ReservationStatus.EN_ATTENTE)
            .sorted((r1, r2) -> r1.getDateReservation().compareTo(r2.getDateReservation()))
            .findFirst()
            .orElse(null);

        if (reservationEnAttente != null) {
            // Passer la réservation en DISPONIBLE
            reservationEnAttente.setStatut(ReservationStatus.DISPONIBLE);
            Reservation updated = reservationRepository.save(reservationEnAttente);
            
            // Retourner la réservation mise à jour avec notification
            return toResponseDTO(updated);
        }

        // Aucune réservation en attente
        return null;
    }

    // HONORER UNE RÉSERVATION : L'utilisateur vient chercher le livre réservé
    @Transactional
    public ReservationResponseDTO honorerReservation(Integer reservationId) {
        Reservation reservation = reservationRepository.findById(reservationId)
            .orElseThrow(() -> new NotFoundException("Réservation non trouvée avec l'ID : " + reservationId));

        if (reservation.getStatut() != ReservationStatus.DISPONIBLE) {
            throw new IllegalStateException("Seules les réservations DISPONIBLES peuvent être honorées.");
        }

        reservation.setStatut(ReservationStatus.HONOREE);
        Reservation updated = reservationRepository.save(reservation);
        return toResponseDTO(updated);
    }
}