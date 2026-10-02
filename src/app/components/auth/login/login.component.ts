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
    private _auth: AuthService
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

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.payload = {
      user_name: this.loginForm.value['user_name'],
      password: this.loginForm.value['password'],
    }
    this.loading = true;
    //Call Service 
    this._commonService.post(this._constants.SERVER_URL + "login", this.payload).subscribe({
      next: (res: any) => {
        this.loading = false;
        this._auth.authLogin(res);
        if (res["status_code"] === "success-200") {
          this.onReset();
        }
      },
      error: (error: HttpErrorResponse) => {
        this.loading = false;
        if (error.error && error.error.error_message) {
          this._toastr.error(error.error.error_message, "Sign In Failed");
        } else if (error.status === 0) {
          this._toastr.error("Cannot reach authentication server at localhost:8080", "Server Offline");
        } else {
          this._toastr.error("Invalid credentials or server error. Please try again.", "Sign In Failed");
        }
      }
    });
  }

  //Reset Form 
  onReset() {
    //Clear Login form 
    this.loginForm.reset();
  }

}
