import { ConstantsService } from './../../../shared/services/constants.service';
import { CommonService } from './../../../shared/services/common.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Book } from 'src/app/shared/models/book';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.css']
})
export class BooksComponent implements OnInit {

  //Column Names for Table
  displayedColumns: string[] = ['name', 'author_name', 'publication', 'edition', 'publication_date', 'language', 'status'];
  //Table Datasource
  dataSource: MatTableDataSource<Book>;
  //Get HTML element from componet
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  //To Store Loading Infromation
  loading: boolean;

  //Constructor 
  constructor(
    private _common: CommonService,
    private _constants: ConstantsService
  ) { }

  //ng Life Cycle 
  ngOnInit() {
    //Load All Books
    this.getAllBooks();
  }

  //Get All Books
  getAllBooks() {
    this._common.get(this._constants.SERVER_URL + 'books').subscribe((res: any) => {
      console.log(res);
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }, 1000)
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

}
