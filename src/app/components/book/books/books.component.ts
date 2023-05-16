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
import { LoaderService } from 'src/app/loader.service';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.css'],
})
export class BooksComponent implements OnInit {
  //Column Names for Table
  displayedColumns: string[] = [
    'name',
    'author_name',
    'publication',
    'edition',
    'publication_date',
    'language',
    'status',
    'action',
  ];
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

  //Check Status
  status: boolean;

  //Constructor
  constructor(
    private _common: CommonService,
    private _constants: ConstantsService,
    private _toastr: ToastrService,
    private _router: Router,
    public _loader: LoaderService
  ) {}

  //ng Life Cycle
  ngOnInit() {
    //Load All Books
    this.getAllBooks();
  }

  //ngAfterViewInit()
  ngAfterViewInit() {}

  pageChanged(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.limit = event.pageSize;
    this.getAllBooks();
  }

  //Get All Books
  getAllBooks() {
    this._common
      .get(
        this._constants.SERVER_URL +
          'books' +
          `?pageno=${this.pageIndex}&limit=${this.limit}`
      )
      .subscribe(
        (res: Book[]) => {
          //Set Loader
          this._loader.setLoading(true);
          //Timeout
          setTimeout(() => {
            //Books Table
            this.dataSource = new MatTableDataSource(res['books']);
            this.totalBooks = res['total'];
            this.dataSource.paginator = this.paginator;
            //Reset Loader
            this._loader.setLoading(false);
          }, 3000);
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
        }
      );
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
      text: 'Want to update status as ' + status,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, update it !',
    }).then((result) => {
      if (result.isConfirmed) {
        //Decalre model for update status
        var updateStatus: UpdateStatus = {
          id: id,
          status: status,
          updated_by: JSON.parse(localStorage.getItem('userdetails')).name,
        };
        //update status
        this._common
          .post(this._constants.SERVER_URL + 'book/status', updateStatus)
          .subscribe(
            (res: any) => {
              //Set Loader
              this._loader.setLoading(true);
              //Timeout
              setTimeout(() => {
                //Reload the page
                this.getAllBooks();
                //Reset Loader
                this._loader.setLoading(false);
                //Swal Fire after successfull deletion
                Swal.fire(
                  'Updated!',
                  'Your record has been updated.',
                  'success'
                );
              }, 3000);
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
                  });
                  break;
                }
                case 500: {
                  this._toastr.error(error.error.error_message);
                  break;
                }
                default: {
                  if (error.ok) {
                    this._toastr.error('Backend Server is not running');
                    break;
                  }
                  this._toastr.error(error.statusText);
                  break;
                }
              }
            }
          );
      }
    });
  }
}
