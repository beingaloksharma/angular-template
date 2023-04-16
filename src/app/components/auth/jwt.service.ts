import { Injectable } from '@angular/core';
import jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class JwtService {

  constructor() { }

  //Decode Token
  DecodeToken(token: string): string {
    return jwt_decode(token);
    }
}
