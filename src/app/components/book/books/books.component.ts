import { ConstantsService } from './../../../shared/services/constants.service';
import { CommonService } from './../../../shared/services/common.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.css']
})
export class BooksComponent implements OnInit {

  //Constructor 
  constructor(
  private _common:CommonService,
  private _constants:ConstantsService
  ){}

  //ng Life Cycle 
  ngOnInit(){
    //Load All Books
    this.getAllBooks();
  }

  //Get All Books
  getAllBooks() {
    this._common.get(this._constants.SERVER_URL+'/books').subscribe((res:any) => {
      console.log(res);
    });
  }

}
