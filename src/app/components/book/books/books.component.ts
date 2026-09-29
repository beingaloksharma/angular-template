import { ConstantsService } from './../../../shared/services/constants.service';
import { CommonService } from './../../../shared/services/common.service';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
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
export class BooksComponent implements OnInit, OnDestroy {

  //Column Names for Table
  displayedColumns: string[] = ['id', 'name', 'author_name', 'publication', 'edition', 'publication_date', 'language', 'status', 'action'];
  //Table Datasource
  dataSource: MatTableDataSource<Book>;
  //Get HTML element from componet
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  // ********************** Mat Paginator Input ******************** //
  pageIndex: number = 0;
  totalBooks: number = 0;
  activeBooks: number = 0;
  deletedBooks: number = 0;
  totalAuthors: number = 0;
  filterStatus: string = 'all';
  limit: number = 5;
  // ********************** Mat Paginator ******************** //

  //To Store Loading Infromation
  loading: boolean;
  //Check Status
  status: boolean;

  // ********************** Total Record Carousel State ******************** //
  carouselIndex: number = 0;
  totalSlides: number = 4;
  isAutoPlay: boolean = true;
  private autoPlayTimer: any;
  carouselMode: 'carousel' | 'grid' = 'carousel';
  isOpen: boolean = false;

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
    if (this.isOpen) {
      this.startAutoPlay();
    }
  }

  ngOnDestroy() {
    this.stopAutoPlay();
  }

  startAutoPlay() {
    this.stopAutoPlay();
    this.autoPlayTimer = setInterval(() => {
      if (this.isAutoPlay && this.carouselMode === 'carousel') {
        this.nextSlide();
      }
    }, 4500);
  }

  stopAutoPlay() {
    if (this.autoPlayTimer) {
      clearInterval(this.autoPlayTimer);
      this.autoPlayTimer = null;
    }
  }

  toggleOpenClose() {
    this.isOpen = !this.isOpen;
    if (!this.isOpen) {
      this.stopAutoPlay();
    } else if (this.isAutoPlay) {
      this.startAutoPlay();
    }
  }

  toggleAutoPlay() {
    this.isAutoPlay = !this.isAutoPlay;
  }

  toggleViewMode() {
    this.carouselMode = this.carouselMode === 'carousel' ? 'grid' : 'carousel';
  }

  nextSlide() {
    this.carouselIndex = (this.carouselIndex + 1) % this.totalSlides;
  }

  prevSlide() {
    this.carouselIndex = (this.carouselIndex - 1 + this.totalSlides) % this.totalSlides;
  }

  setSlide(index: number) {
    this.carouselIndex = index;
  }

  getActivePercentage(): number {
    if (!this.totalBooks) return 0;
    return Math.round((this.activeBooks / this.totalBooks) * 100);
  }

  getArchivedPercentage(): number {
    if (!this.totalBooks) return 0;
    return Math.round((this.deletedBooks / this.totalBooks) * 100);
  }

  //ngAfterViewInit()
  ngAfterViewInit() {
  }

  pageChanged(event?: PageEvent) {
    if (event) {
      this.pageIndex = event.pageIndex;
      this.limit = event.pageSize;
    }
    this.getAllBooks();
  }

  //Get All Books
  getAllBooks() {
    this._common.get(this._constants.SERVER_URL + 'books' + `?pageno=${this.pageIndex}&limit=${this.limit}`).subscribe((res: Book[]) => {
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
        this.dataSource = new MatTableDataSource(res["books"]);
        this.totalBooks = res["total"];
        const books = res["books"] || [];
        this.activeBooks = books.filter(b => b.status === 'Active').length;
        this.deletedBooks = books.filter(b => b.status === 'Delete').length;
        this.totalAuthors = new Set(books.map(b => b.author_name)).size;
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
  setFilter(status: string) {
    this.filterStatus = status;
    if (status === 'all') {
      this.dataSource.filter = '';
    } else {
      this.dataSource.filter = status.trim().toLowerCase();
    }
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  applyFilter(event?: Event) {
    if (event) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource.filter = filterValue.trim().toLowerCase();
    } else {
      this.dataSource.filter = '';
    }

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // Update Book Status (Archive or Restore)
  UpdateBookStatus(id: number, status: string) {
    const isArchive = status === 'Delete';
    Swal.fire({
      title: isArchive ? 'Archive Book?' : 'Restore Book?',
      text: isArchive
        ? 'Are you sure you want to archive this book? It can be restored later.'
        : 'Do you want to restore this book to the active catalog?',
      icon: isArchive ? 'warning' : 'question',
      showCancelButton: true,
      confirmButtonColor: isArchive ? '#ef4444' : '#10b981',
      cancelButtonColor: '#94a3b8',
      confirmButtonText: isArchive ? 'Yes, archive it' : 'Yes, restore it',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        let updatedBy = 'System';
        try {
          const userDetails = JSON.parse(localStorage.getItem('userdetails') || '{}');
          if (userDetails && userDetails.name) {
            updatedBy = userDetails.name;
          }
        } catch (e) {
          // fallback
        }

        var updateStatus: UpdateStatus = { id: id, status: status, updated_by: updatedBy };
        this._common.post(this._constants.SERVER_URL + 'book/status', updateStatus).subscribe((res: any) => {
          Swal.fire({
            title: isArchive ? 'Archived!' : 'Restored!',
            text: isArchive
              ? 'The book has been archived successfully.'
              : 'The book has been restored to the active catalog.',
            icon: 'success',
            confirmButtonColor: '#4f46e5'
          }).then(() => {
            this.loading = true;
            setTimeout(() => {
              this.loading = false;
              this.getAllBooks();
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
