import { Component, OnInit } from '@angular/core';
import { ReservationService } from '../_service/reservation.service';
import { BooksService } from '../_service/books.service';
import { UsersService } from '../_service/users.service';
import { Reservation } from '../_model/reservation';
import { Books } from '../_model/books';
import { Users } from '../_model/users';

@Component({
  selector: 'app-reservations',
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.css']
})
export class ReservationsComponent implements OnInit {

  reservations: Reservation[] = [];
  books: Books[] = [];
  users: Users[] = [];

  // États
  loading = false;
  error: string | null = null;

  // Filtre
  filtreStatut = 'TOUS';

  // Formulaire
  formError: string | null = null;
  formSuccess = false;

  // Annulation
  cancelLoading: number | null = null;

  constructor(
    private reservationService: ReservationService,
    private booksService: BooksService,
    private usersService: UsersService
  ) { }

  ngOnInit(): void {
    this.chargerReservations();
    this.chargerLivres();
    this.chargerUtilisateurs();
  }

  chargerReservations(): void {
    this.loading = true;
    this.error = null;

    const statut = this.filtreStatut === 'TOUS' ? undefined : this.filtreStatut;

    this.reservationService.getReservations(statut).subscribe({
      next: (data) => {
        this.reservations = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message;
        this.loading = false;
      }
    });
  }

  chargerLivres(): void {
    this.booksService.getBooksList().subscribe({
      next: (data) => this.books = data,
      error: (err) => console.error('Erreur chargement livres:', err)
    });
  }

  chargerUtilisateurs(): void {
    this.usersService.getUsersList().subscribe({
      next: (data) => this.users = data,
      error: (err) => console.error('Erreur chargement utilisateurs:', err)
    });
  }

  onFiltreChange(): void {
    this.chargerReservations();
  }

  onCreerReservation(event: { livreId: number; adherentId: number }): void {
    this.formError = null;
    this.formSuccess = false;

    this.reservationService.creerReservation(event.livreId, event.adherentId).subscribe({
      next: () => {
        this.formSuccess = true;
        this.formError = null;
        this.chargerReservations();
        setTimeout(() => this.formSuccess = false, 3000);
      },
      error: (err) => {
        this.formError = err.message;
        this.formSuccess = false;
      }
    });
  }

  onAnnulerReservation(reservation: Reservation): void {
    const confirmation = confirm(
      `Voulez-vous vraiment annuler la réservation #${reservation.id} ?\n` +
      `Livre : ${reservation.livreNom}\n` +
      `Adhérent : ${reservation.adherentNom}`
    );

    if (!confirmation) return;

    this.cancelLoading = reservation.id;

    this.reservationService.annulerReservation(reservation.id).subscribe({
      next: (updated) => {
        const index = this.reservations.findIndex(r => r.id === reservation.id);
        if (index !== -1) {
          this.reservations[index] = updated;
        }
        this.cancelLoading = null;
      },
      error: (err) => {
        alert(err.message);
        this.cancelLoading = null;
      }
    });
  }

  onRetry(): void {
    this.chargerReservations();
  }
}
