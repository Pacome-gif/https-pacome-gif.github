import { Component, OnInit } from '@angular/core';
import { ReservationService } from '../_service/reservation.service';
import { BooksService } from '../_service/books.service';
import { UsersService } from '../_service/users.service';
import { LanguageService } from '../_service/language.service';
import { Reservation } from '../_model/reservation';
import { Books } from '../_model/books';
import { Users } from '../_model/users';

const ROLE_BIBLIOTHECAIRE = 'BIBLIOTHECAIRE';

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

  // Annulation / suppression
  cancelLoading: number | null = null;
  deleteLoading: number | null = null;

  // RS-02 : seul un BIBLIOTHECAIRE peut réserver pour un autre adhérent et supprimer une
  // réservation. Détermine aussi si la liste des adhérents (GET /admin/users) est chargée.
  isBibliothecaire = false;

  constructor(
    private reservationService: ReservationService,
    private booksService: BooksService,
    private usersService: UsersService,
    private languageService: LanguageService
  ) { }

  ngOnInit(): void {
    this.isBibliothecaire = this.usersService.roleMatch([ROLE_BIBLIOTHECAIRE]);
    this.chargerReservations();
    this.chargerLivres();
    if (this.isBibliothecaire) {
      // GET /admin/users est réservé à Admin/BIBLIOTHECAIRE côté backend : inutile (et
      // refusé en 403) de l'appeler pour un simple ADHERENT, qui n'en a de toute façon pas
      // besoin puisqu'il réserve toujours pour lui-même (RS-04).
      this.chargerUtilisateurs();
    }
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

  onCreerReservation(event: { livreId: number; adherentId: number | null }): void {
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
    const confirmation = this.languageService.current === 'en'
      ? confirm(
          `Do you really want to cancel reservation #${reservation.id}?\n` +
          `Book: ${reservation.livreNom}\n` +
          `Member: ${reservation.adherentNom}`
        )
      : confirm(
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

  onSupprimerReservation(reservation: Reservation): void {
    const confirmation = this.languageService.current === 'en'
      ? confirm(
          `Do you really want to permanently delete reservation #${reservation.id}?\n` +
          `Book: ${reservation.livreNom}\n` +
          `Member: ${reservation.adherentNom}\n` +
          `This cannot be undone.`
        )
      : confirm(
          `Voulez-vous vraiment supprimer définitivement la réservation #${reservation.id} ?\n` +
          `Livre : ${reservation.livreNom}\n` +
          `Adhérent : ${reservation.adherentNom}\n` +
          `Cette action est irréversible.`
        );

    if (!confirmation) return;

    this.deleteLoading = reservation.id;

    this.reservationService.supprimerReservation(reservation.id).subscribe({
      next: () => {
        this.reservations = this.reservations.filter(r => r.id !== reservation.id);
        this.deleteLoading = null;
      },
      error: (err) => {
        alert(err.message);
        this.deleteLoading = null;
      }
    });
  }

  onRetry(): void {
    this.chargerReservations();
  }
}
