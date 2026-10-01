import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SuperadminRoutingModule } from './superadmin-routing.module';
import { SuperadminComponent } from './superadmin.component';
import { MaterialUiModule } from 'src/app/shared/material-ui/material-ui.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    SuperadminComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SuperadminRoutingModule,
    MaterialUiModule,
    SharedModule
  ]
})
export class SuperadminModule { }
