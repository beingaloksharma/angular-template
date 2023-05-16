import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from 'src/app/loader.service';
import { Singup } from 'src/app/shared/models/book';
import { CommonService } from 'src/app/shared/services/common.service';
import { ConstantsService } from 'src/app/shared/services/constants.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent {
  //hide
  hide = true;
  //Checked Box - Alignment
  labelPosition: 'after';
  //Singup Form
  signupForm: FormGroup;
  //Payload
  payload: Singup;
  //Check Submission
  isSubmit: boolean = false;

  //Constrcutor
  constructor(
    private _fb: FormBuilder,
    private _constants: ConstantsService,
    private _commonService: CommonService,
    private _toastr: ToastrService,
    private _router: Router,
    public _loader: LoaderService
  ) {}

  //ngOnInit
  ngOnInit(): void {
    //Initialize Book
    this.setInitiaState();
  }

  //Initialize Book Form
  setInitiaState(): void {
    //signupForm
    this.signupForm = this._fb.group({
      name: ['', Validators.compose([Validators.required])],
      email: ['', Validators.compose([Validators.required])],
      moblie: ['', Validators.compose([Validators.required])],
      password: ['', Validators.compose([Validators.required])],
      confirm_password: ['', Validators.compose([Validators.required])],
      terms_and_conditions: [
        true,
        Validators.compose([Validators.requiredTrue]),
      ],
      user_name: ['', Validators.compose([Validators.required])],
    });
  }

  //Control Name
  get ctrl() {
    return this.signupForm.controls;
  }

  //Signup
  singup() {
    //check is submit
    this.isSubmit = true;
    //check signup from validation
    if (this.signupForm.valid) {
      this.payload = {
        name: this.signupForm.value['name'],
        email: this.signupForm.value['email'],
        moblie: this.signupForm.value['moblie'],
        user_name: this.signupForm.value['user_name'],
        password: this.signupForm.value['password'],
        confirm_password: this.signupForm.value['confirm_password'],
        terms_and_conditions: this.signupForm.value['terms_and_conditions'],
        created_by: 'app-user',
      };
      //Call Service
      this._commonService
        .post(this._constants.SERVER_URL + 'signup', this.payload)
        .subscribe(
          (res: any) => {
            //Set Loader
            this._loader.setLoading(true);
            //Timeout
            setTimeout(() => {
              //Reset the form in Initial state
              this.onReset();
              //redirect to home page
              this._router.navigate(['auth/login']);
              //Reset Loader
              this._loader.setLoading(false);
              //Promt success message
              this._toastr.success('User Registered sucessfully');
            }, 3000);
          },
          (error: HttpErrorResponse) => {
            //Print Log
            console.warn('Error Message :: ', error.message);
            console.warn('Error StatusText :: ', error.statusText);
            console.warn('Error URL :: ', error.url);
            //Check Status Code
            switch (error.status) {
              case 400: {
                this._toastr.error(error.error.error_message);
                break;
              }
              case 404: {
                this._toastr.error(error.error.error_message);
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
              case 600: {
                this._toastr.error(error.error.error_message);
                break;
              }
              default: {
                this._toastr.error('Something went wrong');
                break;
              }
            }
          }
        );
    }
  }

  //Reset Form
  onReset() {
    //Clear Singup form
    this.signupForm.reset();
  }
}
