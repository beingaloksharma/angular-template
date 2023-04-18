import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { UserProfile } from 'src/app/shared/models/book';
import { CommonService } from 'src/app/shared/services/common.service';
import { ConstantsService } from 'src/app/shared/services/constants.service';

@Component({
  selector: 'app-myprofile',
  templateUrl: './myprofile.component.html',
  styleUrls: ['./myprofile.component.css']
})
export class MyprofileComponent {

  //To Store user Profile 
  public userProfile:UserProfile

  //Constructor 
  constructor(
    private _common: CommonService,
    private _constants: ConstantsService,
    private _toastr: ToastrService,
  ) {
    //Initialize User Details 
    this.getUserDetails();
   }

  //Life Cycle 
  Oninit() {
  }

  //Get user Details 
  private getUserDetails(){
    //Call Service 
    this._common.get(this._constants.SERVER_URL+ "userprofile?user_name=" +JSON.parse(localStorage["userdetails"])["user_name"]).subscribe((res : UserProfile) => {
      this.userProfile = res;
    },
    (error: HttpErrorResponse) => {
      switch (error.status) {
        case 400: {
          this._toastr.error(error.error.error_message);
          break;
        }
        case 404: {
          this._toastr.error(error.error.error_message);
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
