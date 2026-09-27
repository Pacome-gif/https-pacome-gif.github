package com.ibizabroker.bibliotheque.security;

import com.ibizabroker.bibliotheque.dao.UsersRepository;
import com.ibizabroker.bibliotheque.entity.Users;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

/**
 * Résout l'adhérent authentifié à partir du contexte de sécurité (donc du token JWT courant).
 *
 * RS-04 : l'identité de l'appelant doit toujours être déterminée via ce composant (donc via le
 * token), jamais lue depuis un champ du corps de la requête envoyé par le client.
 */
@Component
@RequiredArgsConstructor
public class CurrentUserProvider {

    private final UsersRepository usersRepository;

    public Users getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new UsernameNotFoundException("Aucun utilisateur authentifié");
        }
        String username = authentication.getName();
        return usersRepository.findByUsername(username)
            .orElseThrow(() -> new UsernameNotFoundException("Utilisateur non trouvé : " + username));
    }

    public boolean isBibliothecaire(Users user) {
        return hasRole(user, RoleNames.BIBLIOTHECAIRE);
    }

    public boolean isAdherent(Users user) {
        return hasRole(user, RoleNames.ADHERENT);
    }

    private boolean hasRole(Users user, String roleName) {
        return user.getRole() != null && user.getRole().stream()
            .anyMatch(role -> roleName.equals(role.getRoleName()));
    }
}
