import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { UserAuthService } from '../_service/user-auth.service';
import { Injectable } from '@angular/core';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private userAuthService: UserAuthService,
    private router:Router
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.headers.get('No-Auth') === 'True') {
      return next.handle(req.clone());
    }

    const token = this.userAuthService.getToken();

    req = this.addToken(req, token);

    return next.handle(req).pipe(
        catchError(
            (err:HttpErrorResponse) => {
                if(err.status === 401) {
                    // Token absent/invalide/expiré : on ne sait plus qui parle, direction connexion.
                    this.userAuthService.clear();
                    this.router.navigate(['/login']);
                }
                // Pour 403 (et le reste), on ne navigue plus d'office : chaque page affiche
                // le message renvoyé par le backend (ex: RS-03, RG-03...) à l'endroit concerné,
                // plutôt que d'éjecter l'utilisateur vers /forbidden pour une action isolée.
                // On repropage l'erreur d'origine (pas une string) pour que le message du
                // backend ({ erreur: "..." }) reste exploitable par le service appelant.
                return throwError(() => err);
            }
        )
    );
  }

  private addToken(request:HttpRequest<any>, token:string) {
      return request.clone(
          {
              setHeaders: {
                  Authorization : `Bearer ${token}`
              }
          }
      );
  }
}