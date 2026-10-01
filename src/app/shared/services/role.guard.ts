import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { RbacService } from './rbac.service';
import { RbacPromptService } from './rbac-prompt.service';
import { UserRole } from '../models/rbac.model';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(
    private rbacService: RbacService,
    private rbacPrompt: RbacPromptService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['auth/login']);
      return false;
    }

    const minRole = (route.data['minRole'] as string || 'user').toLowerCase() as UserRole;
    const allowedRoles = route.data['roles'] as string[];
    const resourceName = route.data['resourceName'] || state.url;
    const primaryRole = this.rbacService.getPrimaryRole();
    const actingRole = this.rbacService.getCurrentRole();

    // 1. Check if user inherently possesses the required permission
    const hasInherent = this.rbacService.hasInherentRole(minRole);

    if (!hasInherent) {
      // User inherently lacks the role (e.g. standard User accessing Admin or Superadmin)
      const allowedActing = this.rbacService.getAllowedActingRoles().map(r => r.toUpperCase()).join(', ');
      this.rbacPrompt.showAccessDenied({
        requiredRole: minRole,
        currentRole: primaryRole,
        resourceName: resourceName,
        actionName: 'Page Navigation Restricted',
        message: `Access Denied: Your account role is ${primaryRole.toUpperCase()} (can only act as: ${allowedActing}). This resource requires ${minRole.toUpperCase()} privileges.`
      });
      return false;
    }

    // 2. If user inherently possesses the permission but is currently acting as a lower role:
    // Automatically elevate acting role to meet the route requirement
    if (!this.rbacService.hasRole(minRole)) {
      this.rbacService.setActingRole(minRole);
    }

    return true;
  }
}
