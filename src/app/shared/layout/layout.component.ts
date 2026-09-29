import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/components/auth/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent {
  name: string = 'User';
  userName: string = '';
  tenantId: string | number = '';

  constructor(
    private _auth: AuthService,
    private _router: Router
  ) {
    try {
      const user = JSON.parse(localStorage.getItem('userdetails') || '{}');
      this.name = user.name || 'User';
      this.userName = user.user_name || '';
      this.tenantId = user.tenant_id || user.id || '1';
    } catch (e) {
      this.name = 'User';
    }
  }

  logout() {
    Swal.fire({
      title: 'Sign Out?',
      text: 'Are you sure you want to end your session?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#4f46e5',
      cancelButtonColor: '#94a3b8',
      confirmButtonText: 'Yes, Sign Out',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this._auth.logout();
      }
    });
  }

  userDetails() {
    try {
      const user = JSON.parse(localStorage.getItem('userdetails') || '{}');
      this._router.navigate(['/user/profile'], { queryParams: { 'user_name': user.user_name || '' } });
    } catch (e) {
      this._router.navigate(['/user/profile']);
    }
  }
}
