package com.ibizabroker.bibliotheque.dto;

import com.ibizabroker.bibliotheque.entity.ReservationStatus;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ReservationResponseDTO {
    private Integer id;
    private Integer livreId;
    private String livreNom;
    private Integer adherentId;
    private String adherentNom;
    private LocalDateTime dateReservation;
    private LocalDateTime dateExpiration;
    private ReservationStatus statut;
}
