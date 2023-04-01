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
    //To Manipulate Request 
    let reqHeader: any;

    //Add Header in request
    reqHeader = request.clone({
      setHeaders: {
        'Content-Type': 'application/json',
        'X-Tenant-Id': '1',
      }
    });

    return next.handle(reqHeader);
  }
}
