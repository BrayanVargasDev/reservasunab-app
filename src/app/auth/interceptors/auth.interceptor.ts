import { inject, Injector } from '@angular/core';
import {
  HttpRequest,
  HttpHandlerFn,
  HttpInterceptorFn,
} from '@angular/common/http';
import { AuthService } from '@auth/services/auth.service';
import { Router } from '@angular/router';
import { StorageService } from '@shared/services/storage.service';
import { STORAGE_KEYS } from '@auth/constants/storage.constants';

export function authInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
) {
  const storage = inject(StorageService);
  const token = storage.getItem(STORAGE_KEYS.TOKEN);
  let newReq = req;

  if (!token) {
    return next(req);
  }

  newReq = req.clone({
    headers: req.headers.append('Authorization', `Bearer ${token}`),
  });

  return next(newReq);
}
