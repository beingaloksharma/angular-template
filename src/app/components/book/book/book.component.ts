import { ToastrService } from 'ngx-toastr';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/shared/services/common.service';
import { ConstantsService } from 'src/app/shared/services/constants.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Book } from 'src/app/shared/models/book';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css']
})
export class BookComponent {
  //To Get Id from URL
  id: number;
  //To Store Book
  book: Book;
  //disabled
  isDisabled: boolean = true;

  //Constructor
  constructor(
    private _route: ActivatedRoute,
    private _common: CommonService,
    private _toastr: ToastrService,
    private _constants: ConstantsService,
    private _router: Router,
  ) {
    //To get params from URL 
    this._route.params.subscribe((res: any) => {
      //To Store Param in id
      this.id = res['id']
    })
  }

  //ngOnInit() - Life Cycle Hooks 
  ngOnInit() {
    //Load UserInfo, When Page Loaded 
    this.getBookById(this.id);
  }

  //getBookById
  public getBookById(id: number) {
    this._common.get(this._constants.SERVER_URL + 'book/' + id).subscribe((res: Book) => {
      setTimeout(() => {
        this.book = res;
      })
    },
      (error: HttpErrorResponse) => {
        switch (error.status) {
          case 400: {
            this._toastr.error(error.error.error_message);
            break;
          }
          case 404: {
            this._toastr.error(error.error.error_message);
            setTimeout(() => {
              this._router.navigate(['/books']);
            }, 3000);
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

  //deleteBook
  deleteBook(id: number) {
    //swal Alert
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        //call delete action
        this._common.delete(this._constants.SERVER_URL + 'book/', id).subscribe((res: any) => {
          setTimeout(() => {
            //Navigate to dashboard
            this._router.navigate(['/books']);
          })
        },
          (error: HttpErrorResponse) => {
            switch (error.status) {
              case 400: {
                this._toastr.error(error.error.error_message);
                break;
              }
              case 404: {
                this._toastr.error(error.error.error_message);
                setTimeout(() => {
                  this._router.navigate(['/books']);
                }, 3000);
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
        //Swal Fire after successfull deletion
        Swal.fire(
          'Deleted!',
          'Your record has been deleted.',
          'success'
        )
      }
    })
  }

}
