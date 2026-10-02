import { Routes } from "@angular/router";
import { RoleGuard } from "../services/role.guard";
import { NotfoundComponent } from "../components/notfound/notfound.component";

export const contentRoutes: Routes = [
  { path: '', redirectTo: 'books', pathMatch: 'full' },
  { path: 'user', loadChildren: () => import('../../components/myprofile/myprofile.module').then(m => m.MyprofileModule) },
  { path: 'books', loadChildren: () => import('../../components/book/book.module').then(m => m.BookModule) },
  {
    path: 'admin',
    loadChildren: () => import('../../components/admin/admin.module').then(m => m.AdminModule),
    canActivate: [RoleGuard],
    data: { minRole: 'admin', resourceName: 'Tenant Workspace Administration' }
  },
  {
    path: 'superadmin',
    loadChildren: () => import('../../components/superadmin/superadmin.module').then(m => m.SuperadminModule),
    canActivate: [RoleGuard],
    data: { minRole: 'superadmin', resourceName: 'Super Administrator Platform Console' }
  }
];
