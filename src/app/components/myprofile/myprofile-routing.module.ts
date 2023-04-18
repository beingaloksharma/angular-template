import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyprofileComponent } from './myprofile.component';


const routes: Routes = [
  {
    path: '', children: [
      { path: '', pathMatch:'full', redirectTo: 'profile' },
      { path: 'profile', component: MyprofileComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyprofileRoutingModule { }
