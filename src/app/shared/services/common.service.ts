import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(
    private _http:HttpClient
  ) { }

  //Get 
  get(url: string): Observable<any> {
    let Headers = new HttpHeaders();
    return this._http.get(url, {
      headers : Headers
    });
  }

  //Post
  post(url: string, model: any): Observable<any> {
    const body = JSON.stringify(model);
    return this._http.post(url, body);
  }

  //Update
  put(url: string, model: any): Observable<any> {
    const body = JSON.stringify(model);
    return this._http.put(url, body);
  }

  //Delete
  delete(url: string, id: number): Observable<any> {
    return this._http.delete(url + id);
  }

}
