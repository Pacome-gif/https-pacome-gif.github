import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';

import {
  MessageErreur,
  Ticket,
  TicketCreationRequest,
  StatutTicket,
} from '../models/ticket.model';
import { ErreurApi } from './erreur-api';

/**
 * Seul point d'entree vers l'API des tickets.
 * Aucun composant n'appelle HttpClient directement : ils passent tous par ici.
 */
@Injectable({ providedIn: 'root' })
export class TicketService {
  private readonly http = inject(HttpClient);

  /**
   * Appel direct du backend : une panne reseau remonte alors en statut 0,
   * ce qui permet d'annoncer "serveur injoignable" plutot qu'une erreur opaque.
   * Le backend autorise l'origine http://localhost:4200 (voir WebConfig).
   */
  private readonly baseUrl = 'http://localhost:8080/api/tickets';

  /** Liste les tickets, filtres par statut si un statut est fourni. */
  lister(statut?: StatutTicket | null): Observable<Ticket[]> {
    const options = statut ? { params: { statut } } : {};
    return this.http
      .get<Ticket[]>(this.baseUrl, options)
      .pipe(catchError((erreur) => this.versErreurApi(erreur)));
  }

  /** Cree un ticket ; le serveur determine le statut et la date. */
  creer(requete: TicketCreationRequest): Observable<Ticket> {
    return this.http
      .post<Ticket>(this.baseUrl, requete)
      .pipe(catchError((erreur) => this.versErreurApi(erreur)));
  }

  /** Ferme un ticket (PATCH /api/tickets/{id}/fermer). */
  fermer(id: number): Observable<Ticket> {
    return this.http
      .patch<Ticket>(`${this.baseUrl}/${id}/fermer`, null)
      .pipe(catchError((erreur) => this.versErreurApi(erreur)));
  }

  /** Traduit toute panne HTTP en ErreurApi porteuse d'un message lisible. */
  private versErreurApi(erreur: HttpErrorResponse): Observable<never> {
    if (erreur.status === 0) {
      return throwError(
        () =>
          new ErreurApi(
            0,
            "Le serveur est injoignable. Vérifiez que le backend est démarré, puis réessayez.",
          ),
      );
    }

    const corps = erreur.error as Partial<MessageErreur> | null;
    const message =
      corps && typeof corps.message === 'string'
        ? corps.message
        : `Le serveur a répondu ${erreur.status}.`;

    return throwError(
      () => new ErreurApi(erreur.status, message, corps?.regle ?? null, corps?.details ?? null),
    );
  }
}
