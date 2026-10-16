import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

import { TicketCreationRequest } from '../../models/ticket.model';

/**
 * Formulaire de creation. Il ne limite PAS la longueur du titre :
 * le refus doit venir du serveur, et son message est affiche ici.
 */
@Component({
  selector: 'app-ticket-form',
  imports: [FormsModule],
  templateUrl: './ticket-form.html',
  styleUrl: './ticket-form.css',
})
export class TicketFormComponent {
  @Input() enCours = false;
  /** Message du serveur (400 ou 409) affiche a cote du formulaire. */
  @Input() erreurServeur: string | null = null;

  @Output() creer = new EventEmitter<TicketCreationRequest>();

  @ViewChild('formulaire') private formulaire?: NgForm;

  titre = '';
  description = '';

  get titreVide(): boolean {
    return this.titre.trim().length === 0;
  }

  soumettre(): void {
    if (this.titreVide || this.enCours) {
      return;
    }

    this.creer.emit({
      titre: this.titre.trim(),
      description: this.description.trim() === '' ? null : this.description.trim(),
    });
  }

  /** Appele par le conteneur apres une creation reussie. */
  reinitialiser(): void {
    this.formulaire?.resetForm();
    this.titre = '';
    this.description = '';
  }
}
