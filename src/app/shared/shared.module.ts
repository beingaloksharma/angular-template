import { MaterialUiModule } from './material-ui/material-ui.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './layout/layout.component';
import { RouterModule } from '@angular/router';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { NotfoundComponent } from './components/notfound/notfound.component';
import { DateagoPipe } from './pipes/dateago.pipe';
import { HeaderComponent } from './components/header/header.component';
import { SideNavComponent } from './components/side-nav/side-nav.component';



@NgModule({
  declarations: [
    LayoutComponent,
    SpinnerComponent,
    NotfoundComponent,
    DateagoPipe,
    HeaderComponent,
    SideNavComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    MaterialUiModule
  ],
  exports: [
    MaterialUiModule,
    SpinnerComponent,
    DateagoPipe
  ]
})
export class SharedModule { }
