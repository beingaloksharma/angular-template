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
    let x_tenant_id: string

    //check localstorage 
    if(localStorage.length === 0){
      x_tenant_id = '0'
    } else {
      x_tenant_id = JSON.parse( localStorage.getItem('userdetails')).id.toString()
    }

    //Add Header in request
    reqHeader = request.clone({
      setHeaders: {
        'Content-Type': 'application/json',
        'X-Tenant-Id': x_tenant_id,
      }
    });

    return next.handle(reqHeader);
  }
}
