package com.ibizabroker.bibliotheque.dao;

import com.ibizabroker.bibliotheque.entity.Reservation;
import com.ibizabroker.bibliotheque.entity.ReservationStatus;
import com.ibizabroker.bibliotheque.entity.Books;
import com.ibizabroker.bibliotheque.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Integer> {

    // RG-02 : Vérifier si un utilisateur a une réservation active sur un livre
    Optional<Reservation> findByUserAndBookAndStatutIn(
        Users user, 
        Books book, 
        List<ReservationStatus> statuts
    );

    // RG-03 : Compter les réservations actives d'un utilisateur
    long countByUserAndStatutIn(Users user, List<ReservationStatus> statuts);

    // Lister les réservations d'un utilisateur
    List<Reservation> findByUser(Users user);

    // Lister les réservations d'un livre
    List<Reservation> findByBook(Books book);

    // Lister par statut
    List<Reservation> findByStatut(ReservationStatus statut);

    // Lister les réservations expirées (pour traitement automatique)
    List<Reservation> findByStatutAndDateExpirationBefore(
        ReservationStatus statut, 
        java.time.LocalDateTime date
    );
}
