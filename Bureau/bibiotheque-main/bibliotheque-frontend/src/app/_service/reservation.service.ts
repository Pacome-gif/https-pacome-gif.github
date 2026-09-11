import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Reservation } from '../_model/reservation';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {

  private baseURL = 'http://localhost:8080/api/reservations';

  constructor(private httpClient: HttpClient) { }

  // Lister toutes les réservations (avec filtre optionnel par statut)
  getReservations(statut?: string): Observable<Reservation[]> {
    let url = this.baseURL;
    if (statut && statut !== 'TOUS') {
      url += `?statut=${statut}`;
    }
    return this.httpClient.get<Reservation[]>(url).pipe(
      catchError(this.handleError)
    );
  }

  // Créer une réservation. adherentId n'est utile que pour un BIBLIOTHECAIRE (RS-02) : pour un
  // ADHERENT, le champ est ignoré côté backend (RS-04 - l'identité vient du token), on ne l'envoie
  // donc même pas dans ce cas.
  creerReservation(livreId: number, adherentId: number | null): Observable<Reservation> {
    const payload: { livreId: number; adherentId?: number } = { livreId };
    if (adherentId !== null) {
      payload.adherentId = adherentId;
    }
    return this.httpClient.post<Reservation>(this.baseURL, payload).pipe(
      catchError(this.handleError)
    );
  }

  // Annuler une réservation
  annulerReservation(id: number): Observable<Reservation> {
    return this.httpClient.patch<Reservation>(`${this.baseURL}/${id}/annuler`, {}).pipe(
      catchError(this.handleError)
    );
  }

  // Supprimer une réservation (réservé au BIBLIOTHECAIRE côté backend)
  supprimerReservation(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.baseURL}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Honorer une réservation (l'utilisateur vient chercher le livre)
  honorerReservation(id: number): Observable<Reservation> {
    return this.httpClient.patch<Reservation>(`${this.baseURL}/${id}/honorer`, {}).pipe(
      catchError(this.handleError)
    );
  }

  // Gestion des erreurs
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Une erreur est survenue. Veuillez réessayer.';

    if (error.error instanceof ErrorEvent) {
      // Erreur côté client
      errorMessage = `Erreur réseau : ${error.error.message}`;
    } else {
      // Erreur côté serveur (le backend renvoie { erreur: "..." })
      if (error.status === 403) {
        // Droits insuffisants (RS-02) ou réservation d'un autre adhérent (RS-03)
        errorMessage = error.error?.erreur || 'Vous n\'avez pas le droit d\'effectuer cette action.';
      } else if (error.status === 409) {
        // Conflit métier (livre disponible, réservation existante, quota atteint)
        errorMessage = error.error?.erreur || 'Conflit : ' + (error.message || 'Opération refusée');
      } else if (error.status === 400) {
        // Mauvaise requête (champs manquants)
        errorMessage = error.error?.erreur || 'Données invalides. Veuillez vérifier les champs.';
      } else if (error.status === 404) {
        // Non trouvé
        errorMessage = error.error?.erreur || 'Ressource non trouvée.';
      } else if (error.status === 0) {
        // Serveur injoignable
        errorMessage = 'Le serveur est injoignable. Vérifiez que le backend est démarré.';
      } else {
        errorMessage = `Erreur ${error.status} : ${error.error?.erreur || error.message}`;
      }
    }

    return throwError(() => new Error(errorMessage));
  }
}
