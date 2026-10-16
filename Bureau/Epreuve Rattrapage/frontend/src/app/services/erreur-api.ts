/**
 * Erreur normalisee remontee par le service API.
 * Elle transporte le message lisible du serveur (400, 409) afin que les
 * composants puissent l'afficher tel quel, sans message generique.
 */
export class ErreurApi extends Error {
  constructor(
    /** Code HTTP ; 0 signifie que le serveur est injoignable. */
    public readonly statut: number,
    message: string,
    /** Regle de gestion nommee par le serveur (RG-02, RG-03). */
    public readonly regle: string | null = null,
    public readonly details: string[] | null = null,
  ) {
    super(message);
    this.name = 'ErreurApi';
  }

  get serveurInjoignable(): boolean {
    return this.statut === 0;
  }
}
