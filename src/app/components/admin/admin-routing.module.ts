import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminUsersComponent } from './admin-users/admin-users.component';
import { RoleGuard } from 'src/app/shared/services/role.guard';

const routes: Routes = [
  {
    path: 'users',
    component: AdminUsersComponent,
    canActivate: [RoleGuard],
    data: {
      minRole: 'admin',
      resourceName: 'Tenant Workspace User Management'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
