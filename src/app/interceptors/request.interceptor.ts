import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class RequestInterceptor implements HttpInterceptor {

  constructor() { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let x_tenant_id = '0';
    let token = '';

    try {
      token = localStorage.getItem('token') || '';
      const userStr = localStorage.getItem('userdetails');
      if (userStr) {
        const user = JSON.parse(userStr);
        // Tenant ID mapping: priority to tenant_id from claims
        const role = (user.role || '').toLowerCase();
        if (role === 'superadmin') {
          x_tenant_id = '0';
        } else if (user.tenant_id) {
          x_tenant_id = user.tenant_id.toString();
        } else if (user.id) {
          x_tenant_id = user.id.toString();
        }
      }
    } catch (e) {
      x_tenant_id = '0';
      token = '';
    }

    const headersConfig: Record<string, string> = {
      'Content-Type': 'application/json'
    };

    if (token) {
      headersConfig['Authorization'] = 'Bearer ' + token;
    }

    if (!request.headers.has('X-Tenant-Id')) {
      headersConfig['X-Tenant-Id'] = x_tenant_id;
    }

    const reqHeader = request.clone({
      setHeaders: headersConfig
    });

    return next.handle(reqHeader);
  }
}
