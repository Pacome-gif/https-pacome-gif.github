import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

import { FiltreStatut, StatutTicket, Ticket, TriDate } from '../../models/ticket.model';

/**
 * Composant d'affichage pur : il ne connait ni HttpClient ni le service.
 * Le conteneur lui donne les donnees et recoit ses evenements.
 */
@Component({
  selector: 'app-ticket-list',
  imports: [DatePipe],
  templateUrl: './ticket-list.html',
  styleUrl: './ticket-list.css',
})
export class TicketListComponent {
  @Input() tickets: Ticket[] = [];
  @Input() chargement = false;
  @Input() erreur: string | null = null;
  @Input() filtre: FiltreStatut = 'TOUS';

  /** Tri et pagination : le conteneur fournit l'etat, le composant l'affiche. */
  @Input() tri: TriDate = 'recent';
  @Input() page = 1;
  @Input() nbPages = 1;
  @Input() premier = 0;
  @Input() dernier = 0;
  @Input() total = 0;

  @Output() changerFiltre = new EventEmitter<FiltreStatut>();
  @Output() changerTri = new EventEmitter<TriDate>();
  @Output() pagePrecedente = new EventEmitter<void>();
  @Output() pageSuivante = new EventEmitter<void>();
  @Output() fermer = new EventEmitter<number>();
  @Output() reessayer = new EventEmitter<void>();

  /** Un clic sur l'en-tete « Date de creation » inverse le sens du tri. */
  basculerTri(): void {
    this.changerTri.emit(this.tri === 'recent' ? 'ancien' : 'recent');
  }

  /** Le bouton Fermer n'apparait que pour un ticket OUVERT ou EN_COURS (RG-03). */
  peutEtreFerme(ticket: Ticket): boolean {
    return ticket.statut === 'OUVERT' || ticket.statut === 'EN_COURS';
  }

  surChangementFiltre(evenement: Event): void {
    const valeur = (evenement.target as HTMLSelectElement).value as FiltreStatut;
    this.changerFiltre.emit(valeur);
  }

  classeBadge(statut: StatutTicket): string {
    return `badge badge-${statut.toLowerCase()}`;
  }
}
