import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/components/auth/auth.service';
import { RbacService } from '../services/rbac.service';
import { RbacPromptService } from '../services/rbac-prompt.service';
import { UserRole } from '../models/rbac.model';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit, OnDestroy {
  name: string = 'User';
  userName: string = '';
  tenantId: string | number = '';

  primaryRole: UserRole = 'user';
  actingRole: UserRole = 'user';
  allowedActingRoles: UserRole[] = ['user'];
  switchingRole: boolean = false;

  private subs: Subscription = new Subscription();

  constructor(
    private _auth: AuthService,
    private _router: Router,
    public rbacService: RbacService,
    private rbacPrompt: RbacPromptService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.subs.add(
      this.rbacService.primaryRole$.subscribe((pRole) => {
        this.primaryRole = pRole;
        this.allowedActingRoles = this.rbacService.getAllowedActingRoles();
      })
    );

    this.subs.add(
      this.rbacService.actingRole$.subscribe((aRole) => {
        this.actingRole = aRole;
      })
    );

    this.subs.add(
      this.rbacService.user$.subscribe((user) => {
        if (user) {
          this.name = user.name || 'User';
          this.userName = user.user_name || '';
          this.tenantId = user.tenant_id !== undefined ? user.tenant_id : (user.id || '1');
        } else {
          this.name = 'User';
          this.userName = '';
          this.tenantId = '1';
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  /**
   * Set the acting role scope (Hierarchical persona switch)
   */
  selectActingRole(role: UserRole): void {
    if (!this.allowedActingRoles.includes(role)) {
      this.rbacPrompt.showAccessDenied({
        requiredRole: role,
        currentRole: this.primaryRole,
        actionName: `Assume ${role.toUpperCase()} Persona`,
        message: `Your account role is ${this.primaryRole.toUpperCase()}. You are only permitted to act as: [${this.allowedActingRoles.join(', ').toUpperCase()}].`
      });
      return;
    }

    if (this.actingRole === role) {
      return;
    }

    this.rbacService.setActingRole(role);
    this.toastr.info(`Now acting as ${role.toUpperCase()} mode`, 'Role Scope Changed');
  }

  /**
   * Quick live login switch between the 3 documented seed accounts
   */
  switchAccount(targetAccount: UserRole): void {
    if (this.primaryRole === targetAccount && this.actingRole === targetAccount) {
      return;
    }

    this.switchingRole = true;
    this.rbacService.switchRoleLive(targetAccount).subscribe({
      next: (res: any) => {
        this.switchingRole = false;
        if (res.status_code === 'success-200') {
          const user = this.rbacService.setSession(res.status_message);
          this.toastr.success(`Logged in as @${user.user_name} (${targetAccount.toUpperCase()})`, 'Account Switched');
          this._router.navigate(['/books']).then(() => {
            window.location.reload();
          });
        } else {
          this.toastr.error('Account switch failed: ' + (res.status_message || ''));
        }
      },
      error: () => {
        this.switchingRole = false;
        this.toastr.error('Account switch failed. Ensure backend microservice is running.');
      }
    });
  }

  /**
   * Test restricted access prompt
   */
  testRestrictedAction(): void {
    if (this.actingRole === 'user' || this.primaryRole === 'user') {
      this.rbacPrompt.showAccessDenied({
        requiredRole: 'admin',
        currentRole: this.actingRole,
        resourceName: 'Tenant Workspace Administration & User Management',
        actionName: 'Restricted Action Trigger',
        message: 'Standard Users can act ONLY as User. Administrative features require Admin or Super Admin role.'
      });
    } else if (this.actingRole === 'admin' || this.primaryRole === 'admin') {
      this.rbacPrompt.showAccessDenied({
        requiredRole: 'superadmin',
        currentRole: this.actingRole,
        resourceName: 'Platform Multi-Tenant Provisioning Console',
        actionName: 'Cross-Tenant Schema Modification',
        message: 'Admins can act as Admin and User, but CANNOT act as Super Admin.'
      });
    } else {
      Swal.fire({
        icon: 'info',
        title: 'Super Admin Access',
        text: 'Superadmin acts as Super Admin, Admin, and User! Use the "Acting As" mode switcher in the navbar to test how the UI adapts to Admin and User perspectives.',
        confirmButtonColor: '#4f46e5'
      });
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
