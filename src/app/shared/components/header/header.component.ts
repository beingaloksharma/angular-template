import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/components/auth/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  @Output() toggleSidebarForMe: EventEmitter<any> = new EventEmitter();

  constructor(
    private _auth:AuthService,
    private _router:Router
    ) {}

  ngOnInit(): void {}

  toggleSidebar() {
    this.toggleSidebarForMe.emit();
  }

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
     confirmButtonText: 'Yes, Logout Me !!!'
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

 //navigate To userDetails 
 userDetails() {
   //Route path 
   this._router.navigate(['/user/profile'], {queryParams : {'user_name' : JSON.parse(localStorage["userdetails"])["user_name"]}});
 }

}
