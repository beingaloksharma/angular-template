import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Singup } from 'src/app/shared/models/book';
import { CommonService } from 'src/app/shared/services/common.service';
import { ConstantsService } from 'src/app/shared/services/constants.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  //hide
  hide = true;
  //Checked Box - Alignment
  labelPosition: 'after';
  //Singup Form 
  signupForm: FormGroup;
  //Payload 
  payload: Singup
  //Check Submission 
  isSubmit: boolean = false;
  //loading
  loading: boolean;

  //Constrcutor
  constructor(
    private _fb: FormBuilder,
    private _constants: ConstantsService,
    private _commonService: CommonService,
    private _toastr: ToastrService,
    private _router: Router,
  ) { }

  //ngOnInit
  ngOnInit(): void {
    //Initialize Book
    this.setInitiaState();
  }

  //Initialize Book Form 
  setInitiaState(): void {
    //signupForm
    this.signupForm = this._fb.group({
      name: ["", Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.pattern('^[a-zA-Z ]*$') // Letters and spaces only
      ])],
      email: ["", Validators.compose([Validators.required, Validators.email])],
      moblie: ["", Validators.compose([
        Validators.required,
        Validators.pattern('^[0-9]{10}$') // Exact 10 digits
      ])],
      password: ["", Validators.compose([
        Validators.required,
        Validators.minLength(6),
        Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z]).{6,}$') // At least 1 letter and 1 number
      ])],
      confirm_password: ["", Validators.compose([Validators.required])],
      terms_and_conditions: [true, Validators.compose([Validators.requiredTrue])],
      user_name: ["", Validators.compose([
        Validators.required,
        Validators.minLength(4),
        Validators.pattern('^[a-zA-Z0-9_]*$') // Alphanumeric with underscore
      ])],
    }, {
      validator: this.passwordMatchValidator
    });
  }

  // Password match validator
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirm_password');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ mismatch: true });
    } else {
      // Clear mismatch error if it exists, but keep other errors
      if (confirmPassword?.hasError('mismatch')) {
        const errors = confirmPassword.errors;
        delete errors['mismatch'];
        confirmPassword.setErrors(Object.keys(errors).length ? errors : null);
      }
    }
  }

  //Control Name 
  get ctrl() {
    return this.signupForm.controls;
  }

  //Signup
  signup() {
    //check is submit 
    this.isSubmit = true;

    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }

    this.payload = {
      name: this.signupForm.value['name'],
      email: this.signupForm.value['email'],
      moblie: this.signupForm.value['moblie'],
      user_name: this.signupForm.value['user_name'],
      password: this.signupForm.value['password'],
      confirm_password: this.signupForm.value['confirm_password'],
      terms_and_conditions: this.signupForm.value['terms_and_conditions'],
      created_by: "app-user",
    }
    this.loading = true;
    //Call Service 
    this._commonService.post(this._constants.SERVER_URL + "signup", this.payload).subscribe({
      next: (res: any) => {
        this.loading = false;
        if (res["status_code"] === 'success-200') {
          this._toastr.success("Account registered successfully! You can now sign in.", "Registration Succeeded");
          this.onReset();
          this._router.navigate(['auth/login']);
        } else {
          this._toastr.error(res["status_message"] || "Failed to register account", "Registration Error");
        }
      },
      error: (error: HttpErrorResponse) => {
        this.loading = false;
        const msg = error.error?.error_message || error.error?.message || "Registration failed. Please check form fields.";
        this._toastr.error(msg, "Registration Error");
      }
    });
  }

  //Reset Form 
  onReset() {
    //Clear Singup form 
    this.signupForm.reset();
  }


}
