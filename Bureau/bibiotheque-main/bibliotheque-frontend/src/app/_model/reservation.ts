export class Reservation {
    id: number;
    livreId: number;
    livreNom: string;
    adherentId: number;
    adherentNom: string;
    dateReservation: Date;
    dateExpiration: Date;
    statut: string;
}
