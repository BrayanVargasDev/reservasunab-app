import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserStateEventsService {
  private profileCompletedSubject = new Subject<void>();
  private termsAcceptedSubject = new Subject<void>();

  // Observable para escuchar cuando el perfil se completa
  profileCompleted$ = this.profileCompletedSubject.asObservable();
  
  // Observable para escuchar cuando se aceptan los términos
  termsAccepted$ = this.termsAcceptedSubject.asObservable();

  // Emitir evento cuando el perfil se complete
  emitProfileCompleted() {
    console.log('[UserStateEvents] Perfil completado - emitiendo evento');
    this.profileCompletedSubject.next();
  }

  // Emitir evento cuando se acepten los términos
  emitTermsAccepted() {
    console.log('[UserStateEvents] Términos aceptados - emitiendo evento');
    this.termsAcceptedSubject.next();
  }
}