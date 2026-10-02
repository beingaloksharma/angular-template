import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { JwtService } from './jwt.service';
import { RbacService } from 'src/app/shared/services/rbac.service';
import { ToastrService } from 'ngx-toastr';

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
    private jwtService: JwtService,
    private rbacService: RbacService,
    private toastr: ToastrService
  ) {
    // Restore session on page reload if token exists
    const token = localStorage.getItem('token');
    if (token) {
      this.currentUser.next(token);
      this.loggedIn.next(true);
      this.rbacService.syncFromStorage();
    }
  }

  authLogin(res: any) {
    if (res["status_code"] != "success-200") {
      localStorage.clear();
      this.currentUser.next(null);
      this.loggedIn.next(false);
      this.rbacService.syncFromStorage();
      this.toastr.error(res["status_message"] || "Authentication failed. Please verify credentials.", "Login Error");
    } else {
      const token = res["status_message"];
      localStorage.setItem("token", token);
      const decoded: any = this.jwtService.DecodeToken(token);
      localStorage.setItem("userdetails", JSON.stringify(decoded));
      const role = (decoded.role || 'user').toLowerCase();
      localStorage.setItem("acting_role", role);
      this.currentUser.next(token);
      this.loggedIn.next(true);
      this.rbacService.syncFromStorage();
      this.toastr.success(`Welcome back, ${decoded.name || decoded.user_name || 'User'}!`, 'Authenticated');
      // redirect to home page 
      this._router.navigate(['/books']);
    }
  }

  logout() {
    localStorage.clear();
    this.currentUser.next(null);
    this.loggedIn.next(false);
    this.rbacService.syncFromStorage();
    this.toastr.info('Signed out successfully.', 'Session Ended');
    this._router.navigate(['auth/login']);
  }
}

