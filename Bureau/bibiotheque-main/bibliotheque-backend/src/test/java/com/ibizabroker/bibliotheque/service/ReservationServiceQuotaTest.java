package com.ibizabroker.bibliotheque.service;

import com.ibizabroker.bibliotheque.dao.BooksRepository;
import com.ibizabroker.bibliotheque.dao.ReservationRepository;
import com.ibizabroker.bibliotheque.dao.UsersRepository;
import com.ibizabroker.bibliotheque.dto.ReservationRequestDTO;
import com.ibizabroker.bibliotheque.dto.ReservationResponseDTO;
import com.ibizabroker.bibliotheque.entity.Books;
import com.ibizabroker.bibliotheque.entity.ReservationStatus;
import com.ibizabroker.bibliotheque.entity.Users;
import com.ibizabroker.bibliotheque.security.CurrentUserProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

/**
 * Test unitaire de la règle RG-03 (limite de 3 réservations actives par adhérent).
 *
 * Le ReservationRepository (et les autres dépendances) sont simulés avec Mockito : aucune base
 * de données réelle n'est sollicitée, le test s'exécute donc indépendamment de toute connexion.
 */
@ExtendWith(MockitoExtension.class)
class ReservationServiceQuotaTest {

    @Mock
    private ReservationRepository reservationRepository;

    @Mock
    private BooksRepository booksRepository;

    @Mock
    private UsersRepository usersRepository;

    @Mock
    private CurrentUserProvider currentUserProvider;

    @InjectMocks
    private ReservationService reservationService;

    private Users adherent;
    private Books livreIndisponible;
    private ReservationRequestDTO request;

    @BeforeEach
    void setUp() {
        adherent = new Users();
        adherent.setUserId(1);
        adherent.setUsername("adherent1");

        livreIndisponible = new Books();
        livreIndisponible.setBookId(10);
        livreIndisponible.setBookName("Les Misérables");
        livreIndisponible.setNoOfCopies(0);

        request = new ReservationRequestDTO();
        request.setLivreId(10);

        when(booksRepository.findById(10)).thenReturn(Optional.of(livreIndisponible));
        when(currentUserProvider.getCurrentUser()).thenReturn(adherent);
        when(currentUserProvider.isBibliothecaire(adherent)).thenReturn(false);
        when(reservationRepository.findByUserAndBookAndStatutIn(eq(adherent), eq(livreIndisponible), anyList()))
            .thenReturn(Optional.empty());
    }

    @Test
    void unAdherentAyantDeuxReservationsActivesPeutEnCreerUneTroisieme() {
        when(reservationRepository.countByUserAndStatutIn(eq(adherent), anyList())).thenReturn(2L);
        when(reservationRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));

        ReservationResponseDTO response = reservationService.creerReservation(request);

        assertEquals(ReservationStatus.EN_ATTENTE, response.getStatut());
        assertEquals(adherent.getUserId(), response.getAdherentId());
    }

    @Test
    void unAdherentAyantTroisReservationsActivesRecoitUnRefus() {
        when(reservationRepository.countByUserAndStatutIn(eq(adherent), anyList())).thenReturn(3L);

        IllegalStateException exception = assertThrows(IllegalStateException.class,
            () -> reservationService.creerReservation(request));

        assertEquals(true, exception.getMessage().contains("RG-03"));
    }
}
