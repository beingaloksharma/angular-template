import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/components/auth/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent {

  //Constructor 
  constructor(
    private _auth:AuthService
  ){}

  //Logout 
  logout(){
     //swal Alert
     Swal.fire({
      title: 'Are you sure?',
      text: "You want to logout",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
       this._auth.logout()
        //Swal Fire after successfull deletion
        Swal.fire(
          'Logout!',
          'You are redirect to login page.',
          'success'
        )
      }
    })
  }

}
