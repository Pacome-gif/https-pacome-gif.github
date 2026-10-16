export type StatutTicket = 'OUVERT' | 'EN_COURS' | 'FERME';

/** Valeur speciale du filtre : aucun filtre de statut. */
export const TOUS_LES_STATUTS = 'TOUS' as const;

export type FiltreStatut = StatutTicket | typeof TOUS_LES_STATUTS;

/** Sens du tri par date de creation (bonus). */
export type TriDate = 'recent' | 'ancien';

export interface Ticket {
  id: number;
  titre: string;
  description: string | null;
  statut: StatutTicket;
  dateCreation: string;
}

/** Le client n'envoie que le titre et la description. */
export interface TicketCreationRequest {
  titre: string;
  description?: string | null;
}

/** Charge utile d'erreur renvoyee par le backend. */
export interface MessageErreur {
  code: number;
  regle: string | null;
  message: string;
  details: string[] | null;
  horodatage: string;
}
