import { Pipe, PipeTransform } from '@angular/core';
import { LanguageService } from '../_service/language.service';
import { TRANSLATIONS } from './translations';

/**
 * Pipe `translate` : {{ 'form.submit' | translate }}
 * Impur (pure: false) pour se réévaluer dès que la langue change,
 * sans avoir à faire suivre un Observable dans chaque composant.
 */
@Pipe({
  name: 'translate',
  pure: false
})
export class TranslatePipe implements PipeTransform {

  constructor(private languageService: LanguageService) {}

  transform(key: string): string {
    const entry = TRANSLATIONS[key];
    if (!entry) {
      return key;
    }
    return entry[this.languageService.current] || entry.fr;
  }
}
