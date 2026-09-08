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

  // Créer une réservation
  creerReservation(livreId: number, adherentId: number): Observable<Reservation> {
    return this.httpClient.post<Reservation>(this.baseURL, { livreId, adherentId }).pipe(
      catchError(this.handleError)
    );
  }

  // Annuler une réservation
  annulerReservation(id: number): Observable<Reservation> {
    return this.httpClient.patch<Reservation>(`${this.baseURL}/${id}/annuler`, {}).pipe(
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
      // Erreur côté serveur
      if (error.status === 409) {
        // Conflit métier (livre disponible, réservation existante, quota atteint)
        errorMessage = error.error?.message || error.error || 'Conflit : ' + (error.message || 'Opération refusée');
      } else if (error.status === 400) {
        // Mauvaise requête (champs manquants)
        errorMessage = error.error?.message || error.error || 'Données invalides. Veuillez vérifier les champs.';
      } else if (error.status === 404) {
        // Non trouvé
        errorMessage = error.error?.message || error.error || 'Ressource non trouvée.';
      } else if (error.status === 0) {
        // Serveur injoignable
        errorMessage = 'Le serveur est injoignable. Vérifiez que le backend est démarré.';
      } else {
        errorMessage = `Erreur ${error.status} : ${error.error?.message || error.message}`;
      }
    }

    return throwError(() => new Error(errorMessage));
  }
}
