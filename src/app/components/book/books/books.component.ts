import { ConstantsService } from './../../../shared/services/constants.service';
import { CommonService } from './../../../shared/services/common.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Book, UpdateStatus } from 'src/app/shared/models/book';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.css']
})
export class BooksComponent implements OnInit {

  //Column Names for Table
  displayedColumns: string[] = ['id', 'name', 'author_name', 'publication', 'edition', 'publication_date', 'language', 'status', 'action'];
  //Table Datasource
  dataSource: MatTableDataSource<Book>;
  //Get HTML element from componet
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  // ********************** Mat Paginator Input ******************** //
  pageIndex: number = 0;
  totalBooks: number;
  limit: number = 5;
  // ********************** Mat Paginator ******************** //

  //To Store Loading Infromation
  loading: boolean;
  //Check Status
  status: boolean;

  //Constructor 
  constructor(
    private _common: CommonService,
    private _constants: ConstantsService,
    private _toastr: ToastrService,
    private _router: Router,
  ) { }

  //ng Life Cycle 
  ngOnInit() {
    //Load All Books
    this.getAllBooks();
  }

  //ngAfterViewInit()
  ngAfterViewInit() {
  }

  pageChanged(event: PageEvent) {
    this.pageIndex = event.pageIndex
    this.limit = event.pageSize
    this.getAllBooks();
  }

  //Get All Books
  getAllBooks() {
    this._common.get(this._constants.SERVER_URL + 'books' + `?pageno=${this.pageIndex}&limit=${this.limit}`).subscribe((res: Book[]) => {
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
        this.dataSource = new MatTableDataSource(res["books"]);
        this.totalBooks = res["total"]
        this.dataSource.paginator = this.paginator;
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

  //Filter On Table
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  //UpdateBookStatus
  UpdateBookStatus(id: number, status: string) {
    //swal Alert
    Swal.fire({
      title: 'Are you sure?',
      text: "Want to update status as " + status,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, update it !',
    }).then((result) => {
      if (result.isConfirmed) {
        //Decalre model for update status 
        var updateStatus: UpdateStatus = { id: id, status: status, updated_by: JSON.parse(localStorage.getItem('userdetails')).name };
        //update status 
        this._common.post(this._constants.SERVER_URL + 'book/status', updateStatus).subscribe((res: any) => {
          //Swal Fire after successfull deletion
          Swal.fire(
            'Updated!',
            'Your record has been updated.',
            'success'
          ).then(() => {
            // Update the table with latest data
            this.loading = true;
            setTimeout(() => {
              this.loading = false;
              //Reload the page 
              this.getAllBooks();
            }, 1000)
          });
        },
          (error: HttpErrorResponse) => {
            //Standard error handling
            const msg = error.error?.error_message || error.statusText || "Something went wrong";
            this._toastr.error(msg);

            if (error.status === 404) {
              this.loading = true
              setTimeout(() => {
                this._router.navigate(['/books']);
                this.loading = false;
              }, 3000);
            }
          });
      }
    })
  }

}
