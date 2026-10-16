import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { App } from './app';
import { StatutTicket, Ticket } from './models/ticket.model';
import { API_BASE_URL } from './services/ticket.service';

/** Fabrique un ticket de test ; le serveur n'est pas sollicite. */
function ticket(
  id: number,
  titre: string,
  dateCreation: string,
  statut: StatutTicket = 'OUVERT',
): Ticket {
  return { id, titre, description: null, statut, dateCreation };
}

describe('App (conteneur)', () => {
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('affiche un indicateur de chargement pendant l\'appel', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Chargement des tickets');

    httpMock.expectOne(API_BASE_URL).flush([]);
    fixture.detectChanges();
  });

  it('affiche « Aucun ticket » quand la liste est vide', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    httpMock.expectOne(API_BASE_URL).flush([]);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Aucun ticket');
  });

  it('explique que le serveur est injoignable en cas de panne reseau', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    httpMock
      .expectOne(API_BASE_URL)
      .error(new ProgressEvent('error'), { status: 0, statusText: 'Unknown Error' });
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('injoignable');
  });

  it('peuple le tableau quand le serveur repond', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    httpMock.expectOne(API_BASE_URL).flush([
      {
        id: 1,
        titre: 'Imprimante hors service',
        description: null,
        statut: 'OUVERT',
        dateCreation: '2026-10-16T10:00:00',
      },
    ]);
    fixture.detectChanges();

    const texte = fixture.nativeElement.textContent;
    expect(texte).toContain('Imprimante hors service');
    expect(texte).toContain('OUVERT');
  });

  it('trie les tickets par date de creation et inverse le sens au clic', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    httpMock.expectOne(API_BASE_URL).flush([
      ticket(2, 'Milieu', '2026-10-10T09:00:00'),
      ticket(3, 'Plus ancien', '2026-10-01T09:00:00'),
      ticket(1, 'Plus recent', '2026-10-16T09:00:00'),
    ]);
    fixture.detectChanges();

    const titres = (): (string | undefined)[] =>
      Array.from(
        fixture.nativeElement.querySelectorAll('tbody tr .titre') as HTMLElement[],
      ).map((cellule) => cellule.textContent?.trim());

    // Par defaut : du plus recent au plus ancien.
    expect(titres()).toEqual(['Plus recent', 'Milieu', 'Plus ancien']);

    // Un clic sur l'en-tete inverse le sens.
    const entete: HTMLButtonElement = fixture.nativeElement.querySelector('button.tri');
    entete.click();
    fixture.detectChanges();

    expect(titres()).toEqual(['Plus ancien', 'Milieu', 'Plus recent']);
  });

  it('pagine la liste et met a jour l etendue affichee', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    httpMock.expectOne(API_BASE_URL).flush(
      Array.from({ length: 7 }, (_, index) =>
        ticket(index + 1, `Ticket ${index + 1}`, `2026-10-0${index + 1}T09:00:00`),
      ),
    );
    fixture.detectChanges();

    const lignes = (): number => fixture.nativeElement.querySelectorAll('tbody tr').length;

    // Echec explicite plutot qu'un « undefined » silencieux si le bouton manque.
    const bouton = (libelle: string): HTMLButtonElement => {
      const boutons = Array.from(
        fixture.nativeElement.querySelectorAll('button') as HTMLButtonElement[],
      );
      const trouve = boutons.find((candidat) => candidat.textContent?.includes(libelle));
      if (!trouve) {
        throw new Error(`Bouton « ${libelle} » introuvable dans l'ecran.`);
      }
      return trouve;
    };

    // 5 tickets par page, du plus recent au plus ancien : les tickets 7 a 3.
    expect(lignes()).toBe(5);
    expect(fixture.nativeElement.textContent).toContain('1–5 sur 7');
    expect(fixture.nativeElement.textContent).toContain('Page 1 / 2');
    expect(fixture.nativeElement.textContent).toContain('7 ticket(s) ouvert(s) sur 7 au total');

    bouton('Suivant').click();
    fixture.detectChanges();

    expect(lignes()).toBe(2);
    expect(fixture.nativeElement.textContent).toContain('6–7 sur 7');
    expect(fixture.nativeElement.textContent).toContain('Page 2 / 2');

    // Le bouton Suivant est desactive sur la derniere page.
    expect(bouton('Suivant').disabled).toBe(true);
  });
});
