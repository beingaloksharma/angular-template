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
  //To Store Loading Infromation
  loading: boolean;
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
      this.loading = true;
      setTimeout(() => {
        this.book = res;
        this.loading = false;
      }, 1000)
    },
      (error: HttpErrorResponse) => {
        switch (error.status) {
          case 400: {
            this._toastr.error(error.error.error_message);
            break;
          }
          case 404: {
            this._toastr.error(error.error.error_message);
            this.loading = true
            setTimeout(() => {
              this._router.navigate(['/books']);
              this.loading = false;
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

  // deleteBook
  deleteBook(id: number) {
    Swal.fire({
      title: 'Delete Book Permanently?',
      text: 'This action cannot be undone. Are you sure you want to remove this book from the catalog?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#94a3b8',
      confirmButtonText: 'Yes, delete permanently',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this._common.delete(this._constants.SERVER_URL + 'book/', id).subscribe((res: any) => {
          Swal.fire({
            title: 'Deleted!',
            text: 'The book has been permanently deleted.',
            icon: 'success',
            confirmButtonColor: '#4f46e5'
          }).then(() => {
            this.loading = true;
            setTimeout(() => {
              this.loading = false;
              this._router.navigate(['/books']);
            }, 1000);
          });
        },
          (error: HttpErrorResponse) => {
            const msg = error.error?.error_message || error.statusText || "Something went wrong";
            this._toastr.error(msg);

            if (error.status === 404) {
              this.loading = true;
              setTimeout(() => {
                this._router.navigate(['/books']);
                this.loading = false;
              }, 3000);
            }
          });
      }
    });
  }

}
