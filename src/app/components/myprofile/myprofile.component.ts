import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DeactivateTenant, UserProfile } from 'src/app/shared/models/book';
import { CommonService } from 'src/app/shared/services/common.service';
import { ConstantsService } from 'src/app/shared/services/constants.service';
import Swal from 'sweetalert2';
import { RbacService } from 'src/app/shared/services/rbac.service';
import { RbacPromptService } from 'src/app/shared/services/rbac-prompt.service';

@Component({
  selector: 'app-myprofile',
  templateUrl: './myprofile.component.html',
  styleUrls: ['./myprofile.component.css']
})
export class MyprofileComponent {

  //To Store user Profile 
  public userProfile: UserProfile
  //To Store user name 
  user_name: string = "";
  //To Store Loading Infromation
  loading: boolean;
  //Cover open/close toggle state
  isCoverOpen: boolean = true;

  //Constructor 
  constructor(
    private _common: CommonService,
    private _constants: ConstantsService,
    private _toastr: ToastrService,
    private _route: ActivatedRoute,
    private _router: Router,
    public rbacService: RbacService,
    private rbacPrompt: RbacPromptService
  ) {
    //Get Query param value 
    this._route.queryParams.subscribe(params => {
      //Initialize User_name 
      this.user_name = params['user_name'];
    }
    )
  }

  //Life Cycle 
  ngOnInit() {
    try {
      const saved = localStorage.getItem('profile_cover_open');
      if (saved !== null) {
        this.isCoverOpen = saved === 'true';
      }
    } catch (e) {
      // default open
    }
    this.getUserDetails(this.user_name);
  }

  // Toggle Cover Banner Open / Close
  toggleCover() {
    this.isCoverOpen = !this.isCoverOpen;
    try {
      localStorage.setItem('profile_cover_open', this.isCoverOpen.toString());
    } catch (e) {}
  }

  //Get user Details 
  private getUserDetails(username: string) {
    this.loading = true;
    this._common.get(this._constants.SERVER_URL + "userprofile?user_name=" + username).subscribe({
      next: (res: UserProfile) => {
        this.userProfile = res;
        this.loading = false;
      },
      error: (error: HttpErrorResponse) => {
        this.loading = false;
        const msg = error.error?.error_message || error.statusText || 'Failed to load user profile';
        this._toastr.error(msg);
        if (error.status === 404) {
          this._router.navigate(['/books']);
        }
      }
    });
  }

  // Deactivate or Reactivate Tenant 
  deactivateTenant(status: string) {
    if (!this.rbacService.isSuperAdmin()) {
      this.rbacPrompt.showAccessDenied({
        requiredRole: 'superadmin',
        currentRole: this.rbacService.getCurrentRole(),
        resourceName: 'POST /webstarter/deactivate',
        actionName: status === 'Delete' ? 'Workspace Deactivation' : 'Workspace Reactivation',
        message: 'Under the Swagger RBAC architecture, destructive workspace lifecycle operations are restricted exclusively to Super Administrators (Tier 3).'
      });
      return;
    }

    const isDeactivate = status === 'Delete';
    Swal.fire({
      title: isDeactivate ? 'Deactivate Tenant Workspace?' : 'Reactivate Tenant Workspace?',
      text: isDeactivate
        ? 'Are you sure you want to deactivate your workspace? Active sessions will be suspended.'
        : 'Do you want to reactivate your tenant workspace?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: isDeactivate ? '#ef4444' : '#4f46e5',
      cancelButtonColor: '#94a3b8',
      confirmButtonText: isDeactivate ? 'Yes, Deactivate' : 'Yes, Reactivate',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        let updatedBy = 'System';
        try {
          const userDetails = JSON.parse(localStorage.getItem('userdetails') || '{}');
          if (userDetails && userDetails.name) {
            updatedBy = userDetails.name;
          }
        } catch (e) {
          // fallback
        }

        var deactiateTenant: DeactivateTenant = { status: status, updated_by: updatedBy };
          this.loading = true;
          this._common.post(this._constants.SERVER_URL + 'deactivate', deactiateTenant).subscribe({
            next: () => {
              this.loading = false;
              Swal.fire({
                title: isDeactivate ? 'Deactivated!' : 'Reactivated!',
                text: isDeactivate
                  ? 'Your tenant workspace has been deactivated successfully.'
                  : 'Your tenant workspace is now active.',
                icon: 'success',
                confirmButtonColor: '#4f46e5'
              }).then(() => {
                this._router.navigate(['auth/login']);
              });
            },
            error: (error: HttpErrorResponse) => {
              this.loading = false;
              const msg = error.error?.error_message || error.statusText || "Something went wrong";
              this._toastr.error(msg);
            }
          });
      }
    });
  }

  // Copy text to clipboard helper
  copyToClipboard(text: string | number, label: string) {
    if (!text) return;
    navigator.clipboard.writeText(text.toString()).then(() => {
      this._toastr.info(`${label} copied to clipboard!`);
    }).catch(() => {
      this._toastr.success(`${label} copied!`);
    });
  }

}
