package com.ibizabroker.bibliotheque.dto;

import lombok.Data;
import javax.validation.constraints.NotNull;

@Data
public class ReservationRequestDTO {
    @NotNull(message = "L'ID du livre est obligatoire")
    private Integer livreId;

    @NotNull(message = "L'ID de l'adhérent est obligatoire")
    private Integer adherentId;
}
