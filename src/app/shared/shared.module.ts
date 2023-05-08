import { MaterialUiModule } from './material-ui/material-ui.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './layout/layout.component';
import { RouterModule } from '@angular/router';
import { DateagoPipe } from './pipes/dateago.pipe';
import { HeaderComponent } from './components/header/header.component';
import { SideNavComponent } from './components/side-nav/side-nav.component';
import { FirstletterPipe } from './pipes/firstletter.pipe';


@NgModule({
  declarations: [
    LayoutComponent,
    DateagoPipe,
    HeaderComponent,
    SideNavComponent,
    FirstletterPipe
  ],
  imports: [
    CommonModule,
    RouterModule,
    MaterialUiModule
  ],
  exports: [
    MaterialUiModule,
    DateagoPipe,
    FirstletterPipe
  ]
})
export class SharedModule { }
