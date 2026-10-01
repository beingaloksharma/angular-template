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

  constructor(
    private _router: Router,
    private jwtService: JwtService
  ) {
    // Restore session on page reload if token exists
    const token = localStorage.getItem('token');
    if (token) {
      this.currentUser.next(token);
      this.loggedIn.next(true);
    }
  }

  authLogin(res: any) {
    if (res["status_code"] != "success-200") {
      localStorage.clear();
      this.currentUser.next(null);
      this.loggedIn.next(false);
    } else {
      const token = res["status_message"];
      localStorage.setItem("token", token);
      const decoded = this.jwtService.DecodeToken(token);
      localStorage.setItem("userdetails", JSON.stringify(decoded));
      this.currentUser.next(token);
      this.loggedIn.next(true);
      // redirect to home page 
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
