import { Component, OnInit, computed, inject, signal, viewChild } from '@angular/core';
import { finalize } from 'rxjs';

import { TicketListComponent } from './components/ticket-list/ticket-list';
import { TicketFormComponent } from './components/ticket-form/ticket-form';
import { FiltreStatut, StatutTicket, Ticket, TicketCreationRequest } from './models/ticket.model';
import { ErreurApi } from './services/erreur-api';
import { TicketService } from './services/ticket.service';

/**
 * Conteneur : il detient l'etat et declenche les appels au service.
 * Les composants liste et formulaire restent purement presentatifs.
 */
@Component({
  selector: 'app-root',
  imports: [TicketListComponent, TicketFormComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  private readonly ticketService = inject(TicketService);
  private readonly formulaire = viewChild(TicketFormComponent);

  readonly tickets = signal<Ticket[]>([]);
  readonly chargement = signal(true);
  readonly erreurChargement = signal<string | null>(null);
  readonly filtre = signal<FiltreStatut>('TOUS');

  readonly creationEnCours = signal(false);
  readonly erreurFormulaire = signal<string | null>(null);
  readonly messageAction = signal<string | null>(null);

  /** Bonus : compteur de tickets ouverts parmi les tickets affiches. */
  readonly nbOuverts = computed(
    () => this.tickets().filter((ticket) => ticket.statut === 'OUVERT').length,
  );

  ngOnInit(): void {
    this.charger();
  }

  /** Charge la liste, avec le filtre courant. */
  charger(): void {
    this.chargement.set(true);
    this.erreurChargement.set(null);

    this.ticketService
      .lister(this.statutFiltre())
      .pipe(finalize(() => this.chargement.set(false)))
      .subscribe({
        next: (tickets) => this.tickets.set(tickets),
        error: (erreur: ErreurApi) => this.erreurChargement.set(erreur.message),
      });
  }

  changerFiltre(filtre: FiltreStatut): void {
    this.filtre.set(filtre);
    this.charger();
  }

  /** Cree un ticket, puis rafraichit la liste sans recharger la page. */
  creerTicket(requete: TicketCreationRequest): void {
    this.creationEnCours.set(true);
    this.erreurFormulaire.set(null);
    this.messageAction.set(null);

    this.ticketService
      .creer(requete)
      .pipe(finalize(() => this.creationEnCours.set(false)))
      .subscribe({
        next: () => {
          this.formulaire()?.reinitialiser();
          this.charger();
        },
        // 400 (RG-01) ou 409 (RG-02) : le message du serveur s'affiche tel quel.
        error: (erreur: ErreurApi) => this.erreurFormulaire.set(erreur.message),
      });
  }

  /** Demande confirmation, puis ferme le ticket via PATCH. */
  fermerTicket(id: number): void {
    const ticket = this.tickets().find((candidat) => candidat.id === id);
    const libelle = ticket ? `« ${ticket.titre} »` : `n° ${id}`;

    if (!window.confirm(`Confirmer la fermeture du ticket ${libelle} ?`)) {
      return;
    }

    this.messageAction.set(null);

    this.ticketService.fermer(id).subscribe({
      next: (misAJour) => {
        // Le statut se met a jour dans la liste, sans rechargement de la page.
        this.tickets.update((tickets) =>
          tickets.map((candidat) => (candidat.id === misAJour.id ? misAJour : candidat)),
        );
        // Si un filtre masque desormais ce ticket, on recharge pour rester coherent.
        if (this.statutFiltre() !== null) {
          this.charger();
        }
      },
      // 409 (RG-03) : le message du serveur s'affiche.
      error: (erreur: ErreurApi) => this.messageAction.set(erreur.message),
    });
  }

  private statutFiltre(): StatutTicket | null {
    const filtre = this.filtre();
    return filtre === 'TOUS' ? null : filtre;
  }
}
