package com.ibizabroker.bibliotheque.controller;

import com.ibizabroker.bibliotheque.dao.BooksRepository;
import com.ibizabroker.bibliotheque.dao.ReservationRepository;
import com.ibizabroker.bibliotheque.dao.UsersRepository;
import com.ibizabroker.bibliotheque.entity.Books;
import com.ibizabroker.bibliotheque.entity.Reservation;
import com.ibizabroker.bibliotheque.entity.ReservationStatus;
import com.ibizabroker.bibliotheque.entity.Role;
import com.ibizabroker.bibliotheque.entity.Users;
import com.ibizabroker.bibliotheque.security.RoleNames;
import com.ibizabroker.bibliotheque.util.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.HashSet;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Test d'intégration sur GET /api/reservations et GET /api/reservations/{id}.
 *
 * Le contexte Spring complet est chargé (filtre JWT, configuration Spring Security, service,
 * contrôleur) mais s'appuie sur une base H2 en mémoire (voir src/test/resources/application.properties) :
 * aucune installation manuelle n'est nécessaire, "mvn test" suffit.
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.MOCK)
@AutoConfigureMockMvc
class ReservationSecurityIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UsersRepository usersRepository;

    @Autowired
    private BooksRepository booksRepository;

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private Users adherent1;
    private Users adherent2;
    private Reservation reservationDeAdherent2;

    @BeforeEach
    void setUp() {
        reservationRepository.deleteAll();
        booksRepository.deleteAll();
        usersRepository.deleteAll();

        adherent1 = creerAdherent("adherent1-it");
        adherent2 = creerAdherent("adherent2-it");

        Books livre = new Books();
        livre.setBookName("Livre de test");
        livre.setBookAuthor("Auteur de test");
        livre.setBookGenre("Roman");
        livre.setNoOfCopies(0);
        livre = booksRepository.save(livre);

        reservationDeAdherent2 = new Reservation();
        reservationDeAdherent2.setBook(livre);
        reservationDeAdherent2.setUser(adherent2);
        reservationDeAdherent2.setDateReservation(LocalDateTime.now());
        reservationDeAdherent2.setDateExpiration(LocalDateTime.now().plusDays(7));
        reservationDeAdherent2.setStatut(ReservationStatus.EN_ATTENTE);
        reservationDeAdherent2 = reservationRepository.save(reservationDeAdherent2);
    }

    private Users creerAdherent(String username) {
        Role roleAdherent = new Role();
        roleAdherent.setRoleName(RoleNames.ADHERENT);

        Users user = new Users();
        user.setUsername(username);
        user.setName(username);
        user.setPassword(passwordEncoder.encode("password"));
        user.setRole(new HashSet<>(Collections.singletonList(roleAdherent)));
        return usersRepository.save(user);
    }

    private String tokenPour(Users user) {
        UserDetails userDetails = new User(user.getUsername(), user.getPassword(), Collections.emptyList());
        return jwtUtil.generateToken(userDetails);
    }

    @Test
    void sansTokenLaListeDesReservationsRenvoie401() throws Exception {
        mockMvc.perform(get("/api/reservations"))
            .andExpect(status().isUnauthorized());
    }

    @Test
    void avecUnTokenAdherentLaListeDesReservationsRenvoie200() throws Exception {
        String token = tokenPour(adherent1);

        mockMvc.perform(get("/api/reservations").header("Authorization", "Bearer " + token))
            .andExpect(status().isOk());
    }

    @Test
    void unAdherentConsultantLaReservationDunAutreAdherentRecoit403() throws Exception {
        String token = tokenPour(adherent1);

        mockMvc.perform(get("/api/reservations/" + reservationDeAdherent2.getId())
                .header("Authorization", "Bearer " + token))
            .andExpect(status().isForbidden());
    }
}
