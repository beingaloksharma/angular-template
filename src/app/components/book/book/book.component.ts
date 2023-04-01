import { ToastrService } from 'ngx-toastr';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/shared/services/common.service';
import { ConstantsService } from 'src/app/shared/services/constants.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Book } from 'src/app/shared/models/book';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css']
})
export class BookComponent {
//To Get Id from URL
id : number;
//To Store Book
book : Book;
//To Store Loading Infromation
loading:boolean;
//disabled
isDisabled: boolean = true;

//Constructor
constructor(
  private _route:ActivatedRoute,
  private _common: CommonService,
  private _toastr:ToastrService,
  private _constants: ConstantsService,
  private _router :Router,
){
  //To get params from URL 
  this._route.params.subscribe((res:any) => {
    //To Store Param in id
    this.id = res['id']
   })
}

//ngOnInit() - Life Cycle Hooks 
ngOnInit(){
  //Load UserInfo, When Page Loaded 
  this.getBookById(this.id);
}

//getBookById
public getBookById(id:number) {
  this._common.get(this._constants.SERVER_URL + 'book/' + id).subscribe((res: Book) => {
    this.loading = true;
    setTimeout(() => {
      this.book = res;
      this.loading = false;
    }, 1000)
  },
  (error: HttpErrorResponse) => {
    switch (error.status) {
      case 400: {
        this._toastr.error(error.statusText + " :: " + error.error.error_message);
        break;
      }
      case 403: {
        this._toastr.error(error.statusText + " :: " + error.error.error_message);
        break;
      }
      case 404: {
        this._toastr.error(error.statusText + " :: " + error.error.error_message);
        this.loading = true
        setTimeout(() => {
          this._router.navigate(['/books']);
          this.loading = false;
        }, 3000);
        break;
      }
      case 500: {
        this._toastr.error(error.statusText + " :: " + error.error.error_message);
        break;
      }
      default: {
        this._toastr.error(error.statusText + " :: " + error.error.error_message);
        break;
      }
    }
  });
}

}
