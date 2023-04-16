import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { JwtService } from './jwt.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser = new BehaviorSubject<any>(null); // For Token Use
  private loggedIn = new BehaviorSubject<boolean>(false);

  get CurrentUser() {
    return this.currentUser.asObservable();
  }

  get IsLoggedIn() {
    return this.loggedIn.asObservable();
  }

  constructor(private _router: Router,private jwtService:JwtService) { }

  authLogin(res: any) {
    if (res["status_code"] != "success-200") {
      localStorage.clear();
      this.currentUser.next(null);
      this.loggedIn.next(false);

    } else {
      localStorage.setItem("token", res["status_message"]);
      localStorage.setItem("userdetails", JSON.stringify(this.jwtService.DecodeToken(res["status_message"])));
      this.currentUser.next(res["status_message"]);
      this.loggedIn.next(true);
      //redirect to home page 
      this._router.navigate(['/books']);
    }
  }

  logout() {
    localStorage.clear();
    this.currentUser.next(null);
    this.loggedIn.next(false);
    this._router.navigate(['auth/login']);
  }
}
