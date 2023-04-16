import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Login } from 'src/app/shared/models/book';
import { CommonService } from 'src/app/shared/services/common.service';
import { ConstantsService } from 'src/app/shared/services/constants.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  //hide
  hide = true;
  //Payload 
  payload: Login
  //login Form 
  loginForm: FormGroup;
  //Check Submission 
  isSubmit: boolean = false;
  //loading
  loading: boolean;

  //constructor
  constructor(
    private _fb: FormBuilder,
    private _constants: ConstantsService,
    private _commonService: CommonService,
    private _toastr: ToastrService,
    private _router: Router,
    private _auth:AuthService
  ) { }

  //ngOnInit
  ngOnInit(): void {
    //Initialize Book
    this.setInitiaState();
  }

  //Initialize Book Form 
  setInitiaState(): void {
    //loginForm
    this.loginForm = this._fb.group({
      user_name: ["", Validators.compose([Validators.required])],
      password: ["", Validators.compose([Validators.required])],
    });
  }

  //Control Name 
  get ctrl() {
    return this.loginForm.controls;
  }

  //login
  login() {
    //check is submit 
    this.isSubmit = true;
    //check signup from validation
    if (this.loginForm.valid) {
      this.payload = {
        user_name: this.loginForm.value['user_name'],
        password: this.loginForm.value['password'],
      }
      //Call Service 
      this._commonService.post(this._constants.SERVER_URL + "login", this.payload).subscribe((res: any) => {
        //Promt success message
        this._toastr.success("User Login sucessfully");
        //Set Loader true 
        this.loading = true;
        setTimeout(() => {
          //Call Auth Service 
          this._auth.authLogin(res);
          //Set Loader false 
          this.loading = false;
          //Reset the form in Initial state 
          this.onReset();
        }, 1000)
      },
        (error: HttpErrorResponse) => {
          //Print Log
          console.warn("Error Message :: ", error.message);
          console.warn("Error StatusText :: ", error.statusText);
          console.warn("Error URL :: ", error.url);
          //Check Status Code
          switch (error.status) {
            case 400: {
              this._toastr.error("Bad request");
              break;
            }
            case 500: {
              this._toastr.error("Internal Server Error");
              break;
            }
            case 600: {
              this._toastr.error(error.error['error_message']);
              break;
            }
            case 601: {
              this._toastr.error(error.error['error_message']);
              break;
            }
            default: {
              this._toastr.error("Something went wrong");
              break;
            }
          }
        }
      )
    }
  }

  //Reset Form 
  onReset() {
    //Clear Login form 
    this.loginForm.reset();
  }

}
