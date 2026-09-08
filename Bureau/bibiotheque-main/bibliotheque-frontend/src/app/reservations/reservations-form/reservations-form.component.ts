import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Books } from '../../_model/books';
import { Users } from '../../_model/users';

@Component({
  selector: 'app-reservations-form',
  templateUrl: './reservations-form.component.html',
  styleUrls: ['./reservations-form.component.css']
})
export class ReservationsFormComponent {

  @Input() books: Books[] = [];
  @Input() users: Users[] = [];
  @Input() formError: string | null = null;
  @Input() formSuccess = false;

  @Output() creer = new EventEmitter<{ livreId: number; adherentId: number }>();

  selectedLivreId: number | null = null;
  selectedAdherentId: number | null = null;

  onSubmit(): void {
    if (!this.selectedLivreId || !this.selectedAdherentId) {
      return;
    }
    this.creer.emit({
      livreId: this.selectedLivreId,
      adherentId: this.selectedAdherentId
    });
    // Réinitialiser après émission
    this.selectedLivreId = null;
    this.selectedAdherentId = null;
  }
}
