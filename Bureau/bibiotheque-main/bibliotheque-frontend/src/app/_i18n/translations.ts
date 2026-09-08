import { Lang } from '../_service/language.service';

/**
 * Dictionnaire de traduction FR / EN de l'interface.
 * Ne couvre que le texte statique de l'appli (nav, écran Réservations) :
 * les messages renvoyés par le backend (erreurs métier, validation) restent
 * en français, tels que renvoyés par l'API.
 */
export const TRANSLATIONS: Record<string, Record<Lang, string>> = {
  // Barre de navigation
  'nav.books': { fr: 'Liste des livres', en: 'Book List' },
  'nav.addBook': { fr: 'Ajouter un livre', en: 'Add Book' },
  'nav.users': { fr: 'Liste des utilisateurs', en: 'User List' },
  'nav.registerUser': { fr: 'Inscrire un utilisateur', en: 'Register User' },
  'nav.borrowBooks': { fr: 'Emprunter des livres', en: 'Borrow Books' },
  'nav.returnBooks': { fr: 'Retourner des livres', en: 'Return Books' },
  'nav.reservations': { fr: 'Réservations', en: 'Reservations' },
  'nav.hey': { fr: 'Salut', en: 'Hey' },
  'nav.login': { fr: 'Connexion', en: 'Login' },
  'nav.logout': { fr: 'Déconnexion', en: 'Logout' },

  // Écran Réservations - en-tête et filtre
  'reservations.title': { fr: 'Gestion des Réservations', en: 'Reservation Management' },
  'reservations.filterLabel': { fr: 'Filtrer par statut :', en: 'Filter by status:' },
  'status.TOUS': { fr: 'Tous', en: 'All' },
  'status.EN_ATTENTE': { fr: 'En attente', en: 'Pending' },
  'status.DISPONIBLE': { fr: 'Disponible', en: 'Available' },
  'status.ANNULEE': { fr: 'Annulée', en: 'Cancelled' },
  'status.EXPIREE': { fr: 'Expirée', en: 'Expired' },
  'status.HONOREE': { fr: 'Honorée', en: 'Fulfilled' },

  // Formulaire de création
  'form.title': { fr: 'Créer une réservation', en: 'Create a reservation' },
  'form.book': { fr: 'Livre *', en: 'Book *' },
  'form.bookPlaceholder': { fr: '-- Sélectionnez un livre --', en: '-- Select a book --' },
  'form.bookCopiesSuffix': { fr: 'copie(s) disponible(s)', en: 'copy(ies) available' },
  'form.member': { fr: 'Adhérent *', en: 'Member *' },
  'form.memberPlaceholder': { fr: '-- Sélectionnez un adhérent --', en: '-- Select a member --' },
  'form.submit': { fr: 'Réserver', en: 'Reserve' },
  'form.errorPrefix': { fr: 'Erreur :', en: 'Error:' },
  'form.successPrefix': { fr: 'Succès :', en: 'Success:' },
  'form.successMessage': { fr: 'Réservation créée avec succès !', en: 'Reservation created successfully!' },

  // Liste des réservations (cartes)
  'list.field.book': { fr: 'Titre du livre', en: 'Book title' },
  'list.field.member': { fr: 'Nom de l\'adhérent', en: 'Member name' },
  'list.field.status': { fr: 'Statut', en: 'Status' },
  'list.field.reservedAt': { fr: 'Date de réservation', en: 'Reservation date' },
  'list.field.expiresAt': { fr: 'Date d\'expiration', en: 'Expiration date' },
  'list.field.action': { fr: 'Action', en: 'Action' },
  'list.cancel': { fr: 'Annuler', en: 'Cancel' },
  'list.loading': { fr: 'Chargement des réservations...', en: 'Loading reservations...' },
  'list.errorTitle': { fr: 'Erreur de connexion', en: 'Connection error' },
  'list.retry': { fr: 'Réessayer', en: 'Retry' },
  'list.emptyTitle': { fr: 'Aucune réservation', en: 'No reservations' },
  'list.emptyText1': { fr: 'Il n\'y a pas de réservation pour le moment.', en: 'There are no reservations at the moment.' },
  'list.emptyText2': { fr: 'Utilisez le formulaire ci-dessus pour en créer une.', en: 'Use the form above to create one.' }
};
