import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserProfile } from 'src/app/shared/models/book';
import { CommonService } from 'src/app/shared/services/common.service';
import { ConstantsService } from 'src/app/shared/services/constants.service';

@Component({
  selector: 'app-userprofile',
  templateUrl: './userprofile.component.html',
  styleUrls: ['./userprofile.component.css']
})
export class UserprofileComponent {

  //To Store User Profile 
  userProfile : UserProfile;
  //To Store Loading Infromation
  loading: boolean = false;

  //Constructor
  constructor(
    private _common: CommonService,
    private _constants: ConstantsService,
    private _toastr:ToastrService,
    private _router: Router
  ) { }

  //Life Cycle Hooks
  OnInit(){
    //Load UserProfile 
    this.getUserDetails();
  }

  //getUserDetails 
  getUserDetails() {
    //call service 
    this._common.get(this._constants.SERVER_URL + 'userprofile?user_name=' + JSON.parse( localStorage.getItem('userdetails')).user_name)
      .subscribe((res: UserProfile) => {
        console.log(res)
        this.userProfile = res
      },
      (error: HttpErrorResponse) => {
        switch (error.status) {
          case 400: {
            this._toastr.error(error.error.error_message);
            break;
          }
          case 404: {
            this._toastr.error(error.error.error_message);
            this.loading = true
            setTimeout(() => {
              this._router.navigate(['/books']);
              this.loading = false;
            }, 3000);
            break;
          }
          case 500: {
            this._toastr.error(error.error.error_message);
            break;
          }
          default: {
            this._toastr.error(error.statusText);
            break;
          }
        }
      });
  }

}
