import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ForgotPassword } from 'src/app/shared/models/book';
import { CommonService } from 'src/app/shared/services/common.service';
import { ConstantsService } from 'src/app/shared/services/constants.service';

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.css']
})
export class ForgotpasswordComponent {
  //hide
  hide = true;
  //forgotForm Form 
  forgotForm: FormGroup;
  //Payload 
  payload: ForgotPassword
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
    //forgotForm
    this.forgotForm = this._fb.group({
      password: ["", Validators.compose([Validators.required, Validators.minLength(6)])],
      confirm_password: ["", Validators.compose([Validators.required])],
      user_name: ["", Validators.compose([Validators.required])],
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
    return this.forgotForm.controls;
  }

  //forgotPassword
  forgotPassword() {
    //check is submit 
    this.isSubmit = true;

    if (this.forgotForm.invalid) {
      this.forgotForm.markAllAsTouched();
      return;
    }

    this.payload = {
      user_name: this.forgotForm.value['user_name'],
      password: this.forgotForm.value['password'],
      confirm_password: this.forgotForm.value['confirm_password'],
    }
    this.loading = true;
    //Call Service 
    this._commonService.post(this._constants.SERVER_URL + "forgot", this.payload).subscribe({
      next: (res: any) => {
        this.loading = false;
        if (res["status_code"] === 'success-200') {
          this._toastr.success("Password reset successfully! Please sign in.", "Password Updated");
          this.onReset();
          this._router.navigate(['auth/login']);
        } else {
          this._toastr.error(res["status_message"] || "Failed to update password", "Reset Error");
        }
      },
      error: (error: HttpErrorResponse) => {
        this.loading = false;
        const msg = error.error?.error_message || error.error?.message || "Failed to reset password. Please try again.";
        this._toastr.error(msg, "Reset Error");
      }
    });
  }

  //Reset Form 
  onReset() {
    //Clear Singup form 
    this.forgotForm.reset();
  }

}
