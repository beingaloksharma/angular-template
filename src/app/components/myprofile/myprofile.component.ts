import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from 'src/app/loader.service';
import { DeactivateTenant, UserProfile } from 'src/app/shared/models/book';
import { CommonService } from 'src/app/shared/services/common.service';
import { ConstantsService } from 'src/app/shared/services/constants.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-myprofile',
  templateUrl: './myprofile.component.html',
  styleUrls: ['./myprofile.component.css'],
})
export class MyprofileComponent {
  //To Store user Profile
  public userProfile: UserProfile;
  //To Store user name
  user_name: string = '';
  // Variable to store file
  file: File = null;

  //Constructor
  constructor(
    private _common: CommonService,
    private _constants: ConstantsService,
    private _toastr: ToastrService,
    private _route: ActivatedRoute,
    private _router: Router,
    public _loader: LoaderService
  ) {
    //Get Query param value
    this._route.queryParams.subscribe((params) => {
      //Initialize User_name
      this.user_name = params['user_name'];
    });
  }

  //Life Cycle
  ngOnInit() {
    this.getUserDetails(this.user_name);
  }

  //Get user Details
  private getUserDetails(username: string) {
    //Call Service
    this._common
      .get(this._constants.SERVER_URL + 'userprofile?user_name=' + username)
      .subscribe(
        (res: UserProfile) => {
          //Set Loader
          this._loader.setLoading(true);
          //Timeout
          setTimeout(() => {
            //Response
            this.userProfile = res;
            //Reset Loader
            this._loader.setLoading(false);
          }, 3000);
        },
        (error: HttpErrorResponse) => {
          switch (error.status) {
            case 400: {
              this._toastr.error(error.error.error_message);
              break;
            }
            case 404: {
              //Set Loader
              this._loader.setLoading(true);
              //Timeout
              setTimeout(() => {
                //redirect to home page
                this._router.navigate(['books']);
                //Reset Loader
                this._loader.setLoading(false);
                //Promt error message
                this._toastr.error(error.error.error_message);
              }, 2000);
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
        }
      );
  }

  //Deactivate Tenant
  deactivateTenant(status: string) {
    //swal Alert
    Swal.fire({
      title: 'Are you sure?',
      text: 'Want to delete your tenant ',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it !',
    }).then((result) => {
      if (result.isConfirmed) {
        //Decalre model for update status
        var deactiateTenant: DeactivateTenant = {
          status: status,
          updated_by: JSON.parse(localStorage.getItem('userdetails')).name,
        };
        //Deactivate Tenant
        this._common
          .post(this._constants.SERVER_URL + 'deactivate', deactiateTenant)
          .subscribe(
            (res: any) => {
              //Set Loader
              this._loader.setLoading(true);
              //Timeout
              setTimeout(() => {
                //Redirect to login page
                this._router.navigate(['auth/login']);
                //Reset Loader
                this._loader.setLoading(false);
                //Swal Fire after successfull deletion
                Swal.fire(
                  'Deleted!',
                  'Your tenant has been deleted.',
                  'success'
                );
              }, 3000);
            },
            (error: HttpErrorResponse) => {
              switch (error.status) {
                case 400: {
                  this._toastr.error(error.error.error_message);
                  break;
                }
                case 404: {
                  //Set Loader
                  this._loader.setLoading(true);
                  //Timeout
                  setTimeout(() => {
                    //redirect to login page
                    this._router.navigate(['auth/login']);
                    //Reset Loader
                    this._loader.setLoading(false);
                    //Promt error message
                    this._toastr.error(error.error.error_message);
                  }, 3000);
                  break;
                }
                case 409: {
                  this._toastr.error(error.error.error_message);
                  break;
                }
                case 500: {
                  this._toastr.error(error.error.error_message);
                  break;
                }
                case 602: {
                  this._toastr.error(error.error.error_message);
                  break;
                }
                default: {
                  if (error.ok) {
                    this._toastr.error('Backend Server is not running');
                    break;
                  }
                  this._toastr.error(error.statusText);
                  break;
                }
              }
            }
          );
      }
    });
  }

  // On file Select
  onChange(event) {
    this.file = event.target.files[0];
    console.log('File :: ', this.file);
  }

  //update Profile
  UpdateProfile() {
    //Call Service
    this._common
      .Upload(this._constants.SERVER_URL + 'update/profile', this.file)
      .subscribe(
        (res: any) => {
          //Set Loader
          this._loader.setLoading(true);
          //Timeout
          setTimeout(() => {
            //Update Profile
            this.getUserDetails(this.user_name);
            //Reset Loader
            this._loader.setLoading(false);
            //Message
            this._toastr.success('Profile image updated successfully');
          }, 3000);
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
        }
      );
  }
}
