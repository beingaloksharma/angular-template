import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { CommonService } from 'src/app/shared/services/common.service';
import { ConstantsService } from 'src/app/shared/services/constants.service';
import { RbacService } from 'src/app/shared/services/rbac.service';
import { UserListItem, CreateTenantUserDTO } from 'src/app/shared/models/rbac.model';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.css']
})
export class AdminUsersComponent implements OnInit {
  displayedColumns: string[] = ['id', 'user_name', 'name', 'email', 'moblie', 'role', 'status', 'created_at', 'action'];
  dataSource: MatTableDataSource<UserListItem> = new MatTableDataSource<UserListItem>([]);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  users: UserListItem[] = [];
  totalUsers: number = 0;
  adminCount: number = 0;
  standardUserCount: number = 0;
  activeCount: number = 0;
  loading: boolean = false;
  filterRole: string = 'all';

  currentUser: any = {};
  showCreateModal: boolean = false;
  submitting: boolean = false;

  newUser: CreateTenantUserDTO = {
    name: '',
    user_name: '',
    email: '',
    moblie: '',
    password: '',
    role: 'user'
  };

  constructor(
    private common: CommonService,
    private constants: ConstantsService,
    private toastr: ToastrService,
    public rbacService: RbacService
  ) {
    this.currentUser = this.rbacService.getCurrentUser();
  }

  ngOnInit(): void {
    this.loadTenantUsers();
  }

  loadTenantUsers(): void {
    this.loading = true;
    this.common.get(this.constants.SERVER_URL + 'admin/users').subscribe({
      next: (res: any) => {
        this.loading = false;
        this.users = res.users || [];
        this.totalUsers = res.total || this.users.length;
        this.adminCount = this.users.filter(u => (u.role || '').toLowerCase() === 'admin').length;
        this.standardUserCount = this.users.filter(u => (u.role || '').toLowerCase() === 'user').length;
        this.activeCount = this.users.filter(u => u.status === 'Active').length;

        this.dataSource.data = this.users;
        if (this.paginator) {
          this.dataSource.paginator = this.paginator;
        }
        if (this.sort) {
          this.dataSource.sort = this.sort;
        }
      },
      error: (err: HttpErrorResponse) => {
        this.loading = false;
        this.dataSource.data = [];
        const msg = err.error?.error_message || err.statusText || 'Failed to load tenant users';
        this.toastr.error(msg);
      }
    });
  }

  applyFilter(event: Event): void {
    if (!this.dataSource) return;
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  setRoleFilter(role: string): void {
    this.filterRole = role;
    if (!this.dataSource) return;
    if (role === 'all') {
      this.dataSource.data = this.users;
    } else {
      this.dataSource.data = this.users.filter(u => (u.role || '').toLowerCase() === role.toLowerCase());
    }
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openCreateModal(): void {
    this.newUser = {
      name: '',
      user_name: '',
      email: '',
      moblie: '',
      password: '',
      role: 'user'
    };
    this.showCreateModal = true;
  }

  closeCreateModal(): void {
    this.showCreateModal = false;
  }

  submitCreateUser(): void {
    if (!this.newUser.name || !this.newUser.user_name || !this.newUser.email || !this.newUser.moblie || !this.newUser.password) {
      this.toastr.warning('Please complete all required fields');
      return;
    }

    this.submitting = true;
    this.common.post(this.constants.SERVER_URL + 'admin/users', this.newUser).subscribe({
      next: (res: any) => {
        this.submitting = false;
        this.closeCreateModal();
        Swal.fire({
          icon: 'success',
          title: 'User Created Successfully',
          text: `User ${this.newUser.user_name} has been provisioned under tenant with role '${this.newUser.role}'.`,
          confirmButtonColor: '#4f46e5'
        });
        this.loadTenantUsers();
      },
      error: (err: HttpErrorResponse) => {
        this.submitting = false;
        const msg = err.error?.error_message || err.error?.message || 'Failed to create user';
        this.toastr.error(msg);
      }
    });
  }

  deleteUser(user: UserListItem): void {
    if (user.user_name === this.currentUser.user_name) {
      Swal.fire({
        icon: 'warning',
        title: 'Action Restricted',
        text: 'You cannot delete your own active administrator account.',
        confirmButtonColor: '#4f46e5'
      });
      return;
    }

    Swal.fire({
      title: 'Soft-Delete User?',
      text: `Are you sure you want to delete user @${user.user_name} (${user.name})? Their workspace access will be revoked.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#94a3b8',
      confirmButtonText: 'Yes, Delete User',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        const payload = {
          id: user.id,
          user_id: user.id,
          tenant_id: user.tenant_id
        };

        this.common.post(this.constants.SERVER_URL + 'admin/users/delete', payload).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'User Deleted',
              text: `User @${user.user_name} has been archived.`,
              confirmButtonColor: '#4f46e5'
            });
            this.loadTenantUsers();
          },
          error: (err: HttpErrorResponse) => {
            const msg = err.error?.error_message || err.statusText || 'Failed to delete user';
            this.toastr.error(msg);
          }
        });
      }
    });
  }
}
