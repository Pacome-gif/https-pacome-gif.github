package com.ibizabroker.bibliotheque.security;

/**
 * Noms des rôles utilisés par le module de réservation.
 *
 * Ces valeurs correspondent au champ {@code roleName} stocké en base (sans préfixe "ROLE_" :
 * le préfixe est ajouté automatiquement par {@code JwtService#getAuthority} au moment de
 * construire les autorités Spring Security).
 */
public final class RoleNames {

    public static final String ADHERENT = "ADHERENT";
    public static final String BIBLIOTHECAIRE = "BIBLIOTHECAIRE";

    private RoleNames() {
    }
}
