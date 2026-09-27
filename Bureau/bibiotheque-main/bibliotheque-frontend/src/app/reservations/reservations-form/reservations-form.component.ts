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
  // RS-04 : un ADHERENT réserve toujours pour lui-même (identité tirée du token côté backend),
  // il n'y a donc pas de sélecteur d'adhérent pour lui. Seul le BIBLIOTHECAIRE choisit pour qui.
  @Input() isBibliothecaire = false;

  @Output() creer = new EventEmitter<{ livreId: number; adherentId: number | null }>();

  selectedLivreId: number | null = null;
  selectedAdherentId: number | null = null;

  get peutSoumettre(): boolean {
    if (!this.selectedLivreId) {
      return false;
    }
    return this.isBibliothecaire ? !!this.selectedAdherentId : true;
  }

  onSubmit(): void {
    if (!this.peutSoumettre) {
      return;
    }
    this.creer.emit({
      livreId: this.selectedLivreId!,
      adherentId: this.isBibliothecaire ? this.selectedAdherentId : null
    });
    // Réinitialiser après émission
    this.selectedLivreId = null;
    this.selectedAdherentId = null;
  }
}
