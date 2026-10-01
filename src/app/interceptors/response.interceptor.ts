import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { RbacPromptService } from '../shared/services/rbac-prompt.service';

@Injectable()
export class ResponseInterceptor implements HttpInterceptor {

  constructor(private rbacPrompt: RbacPromptService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 403) {
          // Backend returned 403 Forbidden - Role permission insufficient
          const errorMsg = error.error?.error_message || error.error?.message || 'Forbidden: Insufficient permissions for this resource';
          this.rbacPrompt.showForbiddenError(errorMsg, request.url);
        } else if (error.status === 401) {
          // Don't intercept 401 if it's the login endpoint itself (invalid credentials)
          if (!request.url.includes('/login') && !request.url.includes('/signup')) {
            const errorMsg = error.error?.error_message || 'Access is unauthorized';
            this.rbacPrompt.showUnauthorizedError(errorMsg);
          }
        }
        return throwError(() => error);
      })
    );
  }
}
