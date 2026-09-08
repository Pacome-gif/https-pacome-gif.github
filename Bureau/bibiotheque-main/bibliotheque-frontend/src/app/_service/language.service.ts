import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type Lang = 'fr' | 'en';

/**
 * Service de langue de l'application : bascule entre français et anglais.
 * Le français reste la langue par défaut au premier chargement.
 */
@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  private readonly STORAGE_KEY = 'bibliotheque_lang';
  private langSubject = new BehaviorSubject<Lang>(this.readInitialLang());
  lang$ = this.langSubject.asObservable();

  private readInitialLang(): Lang {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      return saved === 'en' ? 'en' : 'fr';
    } catch {
      return 'fr';
    }
  }

  get current(): Lang {
    return this.langSubject.value;
  }

  setLang(lang: Lang): void {
    this.langSubject.next(lang);
    try {
      localStorage.setItem(this.STORAGE_KEY, lang);
    } catch {
      // stockage indisponible (navigation privée, etc.) : on continue sans persister
    }
  }

  toggle(): void {
    this.setLang(this.current === 'fr' ? 'en' : 'fr');
  }
}
