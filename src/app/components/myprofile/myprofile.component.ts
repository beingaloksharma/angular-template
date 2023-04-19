import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  public userProfile: UserProfile
  //To Store user name 
  user_name: string = "";
  //To Store Loading Infromation
  loading: boolean;

  //Constructor 
  constructor(
    private _common: CommonService,
    private _constants: ConstantsService,
    private _toastr: ToastrService,
    private _route: ActivatedRoute,
    private _router: Router
  ) {
    //Get Query param value 
    this._route.queryParams.subscribe(params => {
      //Initialize User_name 
      this.user_name = params['user_name'];
    }
    )
  }

  //Life Cycle 
  ngOnInit() {
    this.getUserDetails(this.user_name);
  }

  //Get user Details 
  private getUserDetails(username: string) {
    //Call Service 
    this._common.get(this._constants.SERVER_URL + "userprofile?user_name=" + username).subscribe((res: UserProfile) => {
      this.loading = true;
      setTimeout(() => {
        this.userProfile = res;
        this.loading = false;
      }, 1000)
    },
      (error: HttpErrorResponse) => {
        switch (error.status) {
          case 400: {
            this._toastr.error(error.error.error_message);
            break;
          }
          case 404: {
            this.loading = true;
            setTimeout(() => {
              this._toastr.error(error.error.error_message);
              //redirect to home page 
              this._router.navigate(['books'])
              this.loading = false;
            }, 1000)
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
