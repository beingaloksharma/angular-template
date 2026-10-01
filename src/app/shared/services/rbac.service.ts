import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserRole, DecodedToken } from '../models/rbac.model';
import { ConstantsService } from './constants.service';
import { JwtService } from '../../components/auth/jwt.service';

export const ROLE_RANKS: Record<string, number> = {
  'user': 1,
  'admin': 2,
  'superadmin': 3
};

@Injectable({
  providedIn: 'root'
})
export class RbacService {
  // Primary (JWT-verified) Role
  private primaryRoleSubject = new BehaviorSubject<UserRole>('user');
  public primaryRole$: Observable<UserRole> = this.primaryRoleSubject.asObservable();

  // Active Acting Role (Superadmin can act as Superadmin, Admin, User; Admin as Admin, User; User only as User)
  private actingRoleSubject = new BehaviorSubject<UserRole>('user');
  public actingRole$: Observable<UserRole> = this.actingRoleSubject.asObservable();
  public role$: Observable<UserRole> = this.actingRole$; // alias for backward-compatibility

  private userSubject = new BehaviorSubject<any>(null);
  public user$: Observable<any> = this.userSubject.asObservable();

  constructor(
    private http: HttpClient,
    private constants: ConstantsService,
    private jwtService: JwtService
  ) {
    this.syncFromStorage();
  }

  /**
   * Sync active role and user details from localStorage
   */
  public syncFromStorage(): void {
    try {
      const userStr = localStorage.getItem('userdetails');
      if (userStr) {
        const user = JSON.parse(userStr);
        this.userSubject.next(user);
        const primaryRole = (user.role || 'user').toLowerCase() as UserRole;
        this.primaryRoleSubject.next(primaryRole);

        // Check if saved acting role is valid for this user
        const savedActing = localStorage.getItem('acting_role') as UserRole;
        if (savedActing && this.isRoleAllowedToAct(primaryRole, savedActing)) {
          this.actingRoleSubject.next(savedActing);
        } else {
          this.actingRoleSubject.next(primaryRole);
          localStorage.setItem('acting_role', primaryRole);
        }
        return;
      }
    } catch (e) {
      // ignore parse error
    }
    this.primaryRoleSubject.next('user');
    this.actingRoleSubject.next('user');
    this.userSubject.next(null);
  }

  /**
   * Primary authenticated role (from JWT token)
   */
  public getPrimaryRole(): UserRole {
    return this.primaryRoleSubject.getValue();
  }

  /**
   * Current active acting role
   */
  public getCurrentRole(): UserRole {
    return this.actingRoleSubject.getValue();
  }

  /**
   * Current user object
   */
  public getCurrentUser(): any {
    return this.userSubject.getValue() || {};
  }

  /**
   * Returns which roles the current authenticated user can act as:
   * - superadmin -> ['superadmin', 'admin', 'user']
   * - admin      -> ['admin', 'user']
   * - user       -> ['user']
   */
  public getAllowedActingRoles(): UserRole[] {
    const primary = this.getPrimaryRole();
    if (primary === 'superadmin') {
      return ['superadmin', 'admin', 'user'];
    } else if (primary === 'admin') {
      return ['admin', 'user'];
    }
    return ['user'];
  }

  /**
   * Checks if a primary role is allowed to act as a target role
   */
  public isRoleAllowedToAct(primary: UserRole, target: UserRole): boolean {
    const primaryRank = ROLE_RANKS[primary] || 1;
    const targetRank = ROLE_RANKS[target] || 1;
    return primaryRank >= targetRank;
  }

  /**
   * Switch the active acting persona
   */
  public setActingRole(role: UserRole): boolean {
    if (!this.getAllowedActingRoles().includes(role)) {
      return false;
    }
    this.actingRoleSubject.next(role);
    localStorage.setItem('acting_role', role);
    return true;
  }

  /**
   * Hierarchical permission check based on acting role:
   * user = 1, admin = 2, superadmin = 3
   */
  public hasRole(minRole: UserRole | string): boolean {
    const current = (this.getCurrentRole() || 'user').toLowerCase();
    const required = (minRole || 'user').toLowerCase();
    const currentRank = ROLE_RANKS[current] || 1;
    const requiredRank = ROLE_RANKS[required] || 1;
    return currentRank >= requiredRank;
  }

  /**
   * Inherent check based on the primary JWT role
   */
  public hasInherentRole(minRole: UserRole | string): boolean {
    const primary = (this.getPrimaryRole() || 'user').toLowerCase();
    const required = (minRole || 'user').toLowerCase();
    const primaryRank = ROLE_RANKS[primary] || 1;
    const requiredRank = ROLE_RANKS[required] || 1;
    return primaryRank >= requiredRank;
  }

  public isUser(): boolean {
    return this.getCurrentRole() === 'user';
  }

  public isAdmin(): boolean {
    return this.hasRole('admin');
  }

  public isSuperAdmin(): boolean {
    return this.hasRole('superadmin');
  }

  public canCreateBook(): boolean {
    return this.hasRole('admin');
  }

  public canEditBook(): boolean {
    return this.hasRole('admin');
  }

  public canDeleteBook(): boolean {
    return this.hasRole('admin');
  }

  public canManageTenantUsers(): boolean {
    return this.hasRole('admin');
  }

  public canAccessSuperAdmin(): boolean {
    return this.hasRole('superadmin');
  }

  public canDeactivateTenant(): boolean {
    return this.hasRole('superadmin');
  }

  /**
   * Set user credentials after login or role switch
   */
  public setSession(token: string): any {
    localStorage.setItem('token', token);
    const decoded: any = this.jwtService.DecodeToken(token);
    localStorage.setItem('userdetails', JSON.stringify(decoded));
    const primary = (decoded.role || 'user').toLowerCase() as UserRole;
    localStorage.setItem('acting_role', primary);
    this.syncFromStorage();
    return decoded;
  }

  /**
   * Helper to perform a quick switch between documented test accounts
   */
  public switchRoleLive(targetRole: UserRole): Observable<any> {
    let credentials = { user_name: 'user1', password: 'User@12345!' };
    if (targetRole === 'admin') {
      credentials = { user_name: 'admin1', password: 'Admin@12345!' };
    } else if (targetRole === 'superadmin') {
      credentials = { user_name: 'superadmin', password: 'Super@Admin123!' };
    }

    return this.http.post(this.constants.SERVER_URL + 'login', credentials);
  }
}
