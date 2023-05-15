import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  constructor(private _http: HttpClient) {}

  //Get
  get(url: string): Observable<any> {
    let Headers = new HttpHeaders();
    return this._http.get(url, {
      headers: Headers,
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

  //Upload image
  Upload(url: string, image: File): Observable<any> {
    // Create form data
    const formData = new FormData();
    // Store form name as "file" with file data
    formData.append('image', image, image.name);
    //Header
    let httpHeaders = new HttpHeaders()
    .set('File', 'mulltipart/form-data');
    return this._http.post(url, formData, {headers: httpHeaders});
  }
}
