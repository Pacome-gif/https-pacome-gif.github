import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Reservation } from '../../_model/reservation';

@Component({
  selector: 'app-reservations-list',
  templateUrl: './reservations-list.component.html',
  styleUrls: ['./reservations-list.component.css']
})
export class ReservationsListComponent {

  @Input() reservations: Reservation[] = [];
  @Input() loading = false;
  @Input() error: string | null = null;
  @Input() cancelLoading: number | null = null;

  @Output() retry = new EventEmitter<void>();
  @Output() annuler = new EventEmitter<Reservation>();

  peutAnnuler(statut: string): boolean {
    return statut === 'EN_ATTENTE' || statut === 'DISPONIBLE';
  }

  getStatutClass(statut: string): string {
    switch (statut) {
      case 'EN_ATTENTE': return 'badge bg-warning text-dark';
      case 'DISPONIBLE': return 'badge bg-success';
      case 'ANNULÉE': return 'badge bg-secondary';
      case 'EXPIRÉE': return 'badge bg-danger';
      case 'HONORÉE': return 'badge bg-info';
      default: return 'badge bg-secondary';
    }
  }

  onRetry(): void {
    this.retry.emit();
  }

  onAnnuler(reservation: Reservation): void {
    this.annuler.emit(reservation);
  }
}
