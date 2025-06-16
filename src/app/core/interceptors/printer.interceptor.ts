import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';

export const printerHttpInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  const fullUrl = req.urlWithParams;
  return next(req).pipe(
    tap({
      next: (res) => {
        console.log(`[HTTP SUCCESS] ${req.method} ${fullUrl}`, res);
      },
      error: (error) => {
        console.error(`[HTTP ERROR] ${req.method} ${fullUrl}`, error);
      },
    })
  );
};
