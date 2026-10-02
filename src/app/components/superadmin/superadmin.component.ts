import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import Swal from 'sweetalert2';
import { CommonService } from 'src/app/shared/services/common.service';
import { ConstantsService } from 'src/app/shared/services/constants.service';
import { RbacService } from 'src/app/shared/services/rbac.service';
import { TenantWithUsers, UserListItem, RoleItem, RoleMappingItem, EndpointRoleItem, CreateWorkspaceDTO } from 'src/app/shared/models/rbac.model';

@Component({
  selector: 'app-superadmin',
  templateUrl: './superadmin.component.html',
  styleUrls: ['./superadmin.component.css']
})
export class SuperadminComponent implements OnInit {
  activeTab: 'workspaces' | 'users' | 'books' | 'rbac' = 'workspaces';
  loading: boolean = false;

  // Workspaces Data
  tenants: TenantWithUsers[] = [];
  totalTenants: number = 0;

  // Global Users Data
  allUsers: UserListItem[] = [];
  totalPlatformUsers: number = 0;

  // Global Books Data
  globalBooks: any[] = [];
  totalGlobalBooks: number = 0;

  // RBAC Data
  roles: RoleItem[] = [];
  roleMappings: RoleMappingItem[] = [];
  endpointRoles: EndpointRoleItem[] = [];

  // Create Workspace Modal
  showWorkspaceModal: boolean = false;
  creatingWorkspace: boolean = false;
  newWorkspace: CreateWorkspaceDTO = {
    name: '',
    user_name: '',
    email: '',
    moblie: '',
    password: ''
  };

  constructor(
    private common: CommonService,
    private constants: ConstantsService,
    private toastr: ToastrService,
    public rbacService: RbacService
  ) {}

  ngOnInit(): void {
    this.loadWorkspaces();
  }

  setTab(tab: 'workspaces' | 'users' | 'books' | 'rbac'): void {
    this.activeTab = tab;
    if (tab === 'workspaces' && this.tenants.length === 0) {
      this.loadWorkspaces();
    } else if (tab === 'users' && this.allUsers.length === 0) {
      this.loadPlatformUsers();
    } else if (tab === 'books' && this.globalBooks.length === 0) {
      this.loadGlobalBooks();
    } else if (tab === 'rbac' && this.roles.length === 0) {
      this.loadRbacData();
    }
  }

  loadWorkspaces(): void {
    this.loading = true;
    this.common.get(this.constants.SERVER_URL + 'superadmin/tenants/users').subscribe({
      next: (res: any) => {
        this.loading = false;
        // In backend response: array of tenants with users, or {tenants: [...], total: N}
        if (Array.isArray(res)) {
          this.tenants = res;
          this.totalTenants = res.length;
        } else {
          this.tenants = res.tenants || res.users || [];
          this.totalTenants = res.total || this.tenants.length;
        }
      },
      error: (err: HttpErrorResponse) => {
        this.loading = false;
        this.toastr.error(err.error?.error_message || 'Failed to load workspace tenants');
      }
    });
  }

  loadPlatformUsers(): void {
    this.loading = true;
    this.common.get(this.constants.SERVER_URL + 'superadmin/users').subscribe({
      next: (res: any) => {
        this.loading = false;
        this.allUsers = res.users || (Array.isArray(res) ? res : []);
        this.totalPlatformUsers = res.total || this.allUsers.length;
      },
      error: (err: HttpErrorResponse) => {
        this.loading = false;
        this.toastr.error(err.error?.error_message || 'Failed to load platform users');
      }
    });
  }

  loadGlobalBooks(): void {
    this.loading = true;
    this.common.get(this.constants.SERVER_URL + 'superadmin/books').subscribe({
      next: (res: any) => {
        this.loading = false;
        this.globalBooks = res.books || (Array.isArray(res) ? res : []);
        this.totalGlobalBooks = res.total || this.globalBooks.length;
      },
      error: (err: HttpErrorResponse) => {
        this.loading = false;
        this.toastr.error(err.error?.error_message || 'Failed to load global books');
      }
    });
  }

  loadRbacData(): void {
    this.loading = true;
    forkJoin({
      roles: this.common.get(this.constants.SERVER_URL + 'superadmin/roles'),
      roleMappings: this.common.get(this.constants.SERVER_URL + 'superadmin/role-mappings'),
      endpointRoles: this.common.get(this.constants.SERVER_URL + 'superadmin/endpoint-roles')
    }).subscribe({
      next: (res: any) => {
        this.loading = false;
        this.roles = res.roles?.roles || [];
        this.roleMappings = res.roleMappings?.role_mappings || [];
        this.endpointRoles = res.endpointRoles?.endpoint_roles || [];
      },
      error: (err: HttpErrorResponse) => {
        this.loading = false;
        this.toastr.error(err.error?.error_message || 'Failed to load RBAC security data');
      }
    });
  }

  openWorkspaceModal(): void {
    this.newWorkspace = {
      name: '',
      user_name: '',
      email: '',
      moblie: '',
      password: ''
    };
    this.showWorkspaceModal = true;
  }

  closeWorkspaceModal(): void {
    this.showWorkspaceModal = false;
  }

  submitCreateWorkspace(): void {
    if (!this.newWorkspace.name || !this.newWorkspace.user_name || !this.newWorkspace.email || !this.newWorkspace.password) {
      this.toastr.warning('Please fill in all required fields');
      return;
    }

    this.creatingWorkspace = true;
    this.common.post(this.constants.SERVER_URL + 'superadmin/tenants', this.newWorkspace).subscribe({
      next: (res: any) => {
        this.creatingWorkspace = false;
        this.closeWorkspaceModal();
        Swal.fire({
          icon: 'success',
          title: 'Workspace Provisioned!',
          text: `Tenant workspace for @${this.newWorkspace.user_name} with dedicated schema has been created.`,
          confirmButtonColor: '#4f46e5'
        });
        this.loadWorkspaces();
      },
      error: (err: HttpErrorResponse) => {
        this.creatingWorkspace = false;
        const msg = err.error?.error_message || err.error?.message || 'Failed to create tenant workspace';
        this.toastr.error(msg);
      }
    });
  }
}
