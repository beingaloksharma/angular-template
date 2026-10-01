import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { UserRole } from '../models/rbac.model';

export interface AccessDeniedOptions {
  requiredRole: string;
  currentRole?: string;
  resourceName?: string;
  actionName?: string;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class RbacPromptService {

  constructor(private router: Router) { }

  /**
   * Format role display text with emoji & capitalization
   */
  getRoleBadgeLabel(role: string): { label: string, color: string, bg: string, border: string } {
    const r = (role || 'user').toLowerCase();
    switch (r) {
      case 'superadmin':
        return {
          label: 'Super Admin (Tier 3)',
          color: '#065f46',
          bg: '#d1fae5',
          border: '#6ee7b7'
        };
      case 'admin':
        return {
          label: 'Workspace Admin (Tier 2)',
          color: '#3730a3',
          bg: '#e0e7ff',
          border: '#a5b4fc'
        };
      case 'user':
      default:
        return {
          label: 'Standard User (Tier 1)',
          color: '#1e293b',
          bg: '#f1f5f9',
          border: '#cbd5e1'
        };
    }
  }

  /**
   * Shows a comprehensive, beautifully styled Access Denied modal
   * whenever a user does not have the required role.
   */
  showAccessDenied(options: AccessDeniedOptions): Promise<any> {
    const currentRole = options.currentRole || this.getUserCurrentRole();
    const curBadge = this.getRoleBadgeLabel(currentRole);
    const reqBadge = this.getRoleBadgeLabel(options.requiredRole);

    const resourceHtml = options.resourceName ? `
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 6px 0; border-bottom: 1px dashed #e2e8f0; font-size: 0.88rem;">
        <span style="color: #64748b; font-weight: 600;">Resource / Path:</span>
        <span style="font-family: monospace; background: #f8fafc; padding: 2px 8px; border-radius: 4px; color: #0f172a; font-weight: 600; border: 1px solid #e2e8f0;">
          ${options.resourceName}
        </span>
      </div>
    ` : '';

    const actionHtml = options.actionName ? `
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 6px 0; border-bottom: 1px dashed #e2e8f0; font-size: 0.88rem;">
        <span style="color: #64748b; font-weight: 600;">Action Attempted:</span>
        <span style="color: #b91c1c; font-weight: 700;">
          ${options.actionName}
        </span>
      </div>
    ` : '';

    const htmlContent = `
      <div style="text-align: left; padding: 0.25rem 0;">
        <div style="background: #fef2f2; border-left: 4px solid #ef4444; border-radius: 8px; padding: 12px 14px; margin-bottom: 16px;">
          <p style="margin: 0; color: #991b1b; font-size: 0.92rem; font-weight: 600;">
            ${options.message || 'You do not have the required role permissions to perform this operation.'}
          </p>
        </div>

        <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 12px 16px; margin-bottom: 16px; box-shadow: 0 1px 3px rgba(0,0,0,0.03);">
          ${actionHtml}
          ${resourceHtml}
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px dashed #e2e8f0; font-size: 0.88rem;">
            <span style="color: #64748b; font-weight: 600;">Your Current Role:</span>
            <span style="display: inline-block; padding: 3px 10px; border-radius: 9999px; font-size: 0.8rem; font-weight: 700; color: ${curBadge.color}; background: ${curBadge.bg}; border: 1px solid ${curBadge.border};">
              ${curBadge.label}
            </span>
          </div>

          <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; font-size: 0.88rem;">
            <span style="color: #64748b; font-weight: 600;">Required Minimum Role:</span>
            <span style="display: inline-block; padding: 3px 10px; border-radius: 9999px; font-size: 0.8rem; font-weight: 700; color: ${reqBadge.color}; background: ${reqBadge.bg}; border: 1px solid ${reqBadge.border};">
              ${reqBadge.label}
            </span>
          </div>
        </div>

        <p style="margin: 0; color: #64748b; font-size: 0.825rem; line-height: 1.45;">
          This policy is enforced based on the <strong>WebStarter Swagger RBAC Specification</strong>. If you require access, please contact your tenant administrator or switch to an authorized profile.
        </p>
      </div>
    `;

    return Swal.fire({
      icon: 'error',
      title: 'Access Denied: Insufficient Role',
      html: htmlContent,
      showCancelButton: true,
      confirmButtonColor: '#4f46e5',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Return to Catalog',
      cancelButtonText: 'Dismiss Window',
      customClass: {
        popup: 'swal2-rbac-popup'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigate(['/books']);
      }
      return result;
    });
  }

  /**
   * Shows error when backend responds with 403 Forbidden
   */
  showForbiddenError(backendMessage?: string, url?: string): Promise<any> {
    const currentRole = this.getUserCurrentRole();
    return this.showAccessDenied({
      requiredRole: currentRole === 'user' ? 'admin' : 'superadmin',
      currentRole: currentRole,
      resourceName: url || 'Protected Microservice Endpoint',
      actionName: 'API Request Blocked (HTTP 403 Forbidden)',
      message: backendMessage || 'Forbidden: Insufficient permissions for this API resource.'
    });
  }

  /**
   * Shows error when backend responds with 401 Unauthorized
   */
  showUnauthorizedError(backendMessage?: string): Promise<any> {
    return Swal.fire({
      icon: 'warning',
      title: 'Authentication Required',
      text: backendMessage || 'Your session has expired or is unauthorized. Please sign in again.',
      confirmButtonColor: '#4f46e5',
      confirmButtonText: 'Sign In Again',
      showCancelButton: true,
      cancelButtonText: 'Cancel'
    }).then((res) => {
      if (res.isConfirmed) {
        localStorage.clear();
        this.router.navigate(['auth/login']);
      }
    });
  }

  private getUserCurrentRole(): string {
    try {
      const user = JSON.parse(localStorage.getItem('userdetails') || '{}');
      return user.role || 'user';
    } catch (e) {
      return 'user';
    }
  }
}
