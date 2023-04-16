import { Component, OnInit } from '@angular/core';
import { UserProfile } from 'src/app/shared/models/book';
import { CommonService } from 'src/app/shared/services/common.service';
import { ConstantsService } from 'src/app/shared/services/constants.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {

  //Constructor()
  constructor(
    private _common:CommonService,
    private _constants:ConstantsService
  ){}

  //Life Cycle 
  OnInit(){
    //Load User Profile 
    this.getUserDetails();
  }

  //getUserDetails 
  private getUserDetails(){
    this._common.get(this._constants.SERVER_URL + "userprofile?user_name=" + JSON.parse(localStorage.getItem('userdetails')).user_name).subscribe((res : UserProfile) => {
      console.log(res)
    })
  }

}
