import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SuperadminComponent } from './superadmin.component';
import { RoleGuard } from 'src/app/shared/services/role.guard';

const routes: Routes = [
  {
    path: '',
    component: SuperadminComponent,
    canActivate: [RoleGuard],
    data: {
      minRole: 'superadmin',
      resourceName: 'Super Administrator Console'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SuperadminRoutingModule { }
