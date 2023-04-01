import { MaterialUiModule } from './material-ui/material-ui.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './layout/layout.component';
import { RouterModule } from '@angular/router';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { NotfoundComponent } from './components/notfound/notfound.component';



@NgModule({
  declarations: [
    LayoutComponent,
    SpinnerComponent,
    NotfoundComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    MaterialUiModule
  ],
  exports: [
    MaterialUiModule,
    SpinnerComponent
  ]
})
export class SharedModule { }
