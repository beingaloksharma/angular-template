import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminUsersComponent } from './admin-users/admin-users.component';
import { MaterialUiModule } from 'src/app/shared/material-ui/material-ui.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    AdminUsersComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    AdminRoutingModule,
    MaterialUiModule,
    SharedModule
  ]
})
export class AdminModule { }
