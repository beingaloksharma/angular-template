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
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class ResponseInterceptor implements HttpInterceptor {

  constructor(
    private rbacPrompt: RbacPromptService,
    private toastr: ToastrService
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 0) {
          // Backend service unreachable / network offline
          this.toastr.error(
            'Cannot connect to backend server. Please verify the microservice is running on port 8080.',
            'Service Unreachable',
            { timeOut: 5000 }
          );
        } else if (error.status === 403) {
          // Backend returned 403 Forbidden - Role permission insufficient
          const errorMsg = error.error?.error_message || error.error?.message || 'Forbidden: Insufficient permissions for this resource';
          this.rbacPrompt.showForbiddenError(errorMsg, request.url);
        } else if (error.status === 401) {
          // Don't intercept 401 if it's the login or signup endpoint itself
          if (!request.url.includes('/login') && !request.url.includes('/signup')) {
            localStorage.clear();
            this.toastr.warning('Session expired or unauthorized. Please sign in.', 'Session Expired');
            window.location.href = '/auth/login';
          }
        } else if (error.status === 404) {
          const errorMsg = error.error?.error_message || error.error?.message;
          if (errorMsg && !request.url.includes('/login')) {
            this.toastr.warning(errorMsg, 'Not Found');
          }
        } else if (error.status >= 500) {
          const errorMsg = error.error?.error_message || error.error?.message || 'An internal server error occurred';
          this.toastr.error(errorMsg, `Server Error (${error.status})`);
        }
        return throwError(() => error);
      })
    );
  }
}

