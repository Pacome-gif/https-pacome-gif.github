import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { App } from './app';

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

    httpMock.expectOne('/api/tickets').flush([]);
    fixture.detectChanges();
  });

  it('affiche « Aucun ticket » quand la liste est vide', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    httpMock.expectOne('/api/tickets').flush([]);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Aucun ticket');
  });

  it('explique que le serveur est injoignable en cas de panne reseau', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    httpMock
      .expectOne('/api/tickets')
      .error(new ProgressEvent('error'), { status: 0, statusText: 'Unknown Error' });
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('injoignable');
  });

  it('peuple le tableau quand le serveur repond', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    httpMock.expectOne('/api/tickets').flush([
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
});
