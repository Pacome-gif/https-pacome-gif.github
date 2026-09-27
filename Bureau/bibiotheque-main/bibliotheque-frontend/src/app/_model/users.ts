export class Users {
    userId: number;
    username: string;
    name: string;
    password: string;
    // Initialisé avec une entrée vide : les formulaires (inscription, modification) lient
    // user.role[0].roleName directement, ce qui plantait au premier rendu sur "new Users()"
    // tant que la réponse serveur (ou une valeur choisie) n'avait pas encore rempli le tableau.
    role: any[] = [{ roleName: '' }];
}
