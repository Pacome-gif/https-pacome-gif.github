package com.ibizabroker.bibliotheque.dto;

import lombok.Data;
import javax.validation.constraints.NotNull;

@Data
public class ReservationRequestDTO {
    @NotNull(message = "L'ID du livre est obligatoire")
    private Integer livreId;

    // RS-04 : ce champ n'est utilisé que lorsque l'appelant est BIBLIOTHECAIRE (il désigne alors
    // l'adhérent pour lequel réserver). Pour un ADHERENT, ce champ est ignoré : son identité est
    // toujours déterminée à partir du token, jamais du corps de la requête. Il n'est donc pas
    // obligatoire ici ; la validation de sa présence pour un BIBLIOTHECAIRE se fait dans le service.
    private Integer adherentId;
}
