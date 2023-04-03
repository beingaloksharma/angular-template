import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DBOps } from 'src/app/shared/DBOps/dbops';
import { Book } from 'src/app/shared/models/book';

@Component({
  selector: 'app-create-book',
  templateUrl: './create-book.component.html',
  styleUrls: ['./create-book.component.css']
})
export class CreateBookComponent implements OnInit {
  //Book Category
  categories : string[] = ["Health, Family & Personal Development","Literature & Fiction","Analysis & Strategy","Sciences, Technology & Medicine","Children's Early Learning","New Age & Spirituality"]
  //Edition
  editions : string[] = ["First", "Second","Third","Fourth","Fifth"]
  //language
  languages : string[] = ["Hindi","English","Marathi","Maithali","Bhojpuri","Punjabi","Urdu","Tamil","Telgu"]
  //Year
  years : number[] = new Array();
  //Check Submission 
  isSubmit: boolean = false;
  //Button Text 
  btnText: string;
  //Book Form 
  bookForm: FormGroup;
  //DbOps 
  dbOps: DBOps;
  //payload 
  payload: Book;
  //loading
  loading: boolean;
  //hide me 
  hideme: boolean = true;
  //minimum date
  minDate = new Date(1947, 0, 1);
  //maximum date
  maxDate = new Date(2005, 0, 1);

  //Constructor 
  constructor(
    private _fb: FormBuilder
  ) { 

    //loop for year 
    for (let i = new Date().getFullYear(); i > 1970; i--) {
       this.years.push(i);
    }
  
  }

  //ngOnInit
  ngOnInit() {
    //Initialize Book
    this.setInitiaState();
  }

  //Initialize Book Form 
  setInitiaState(): void {
    //Button Action Name 
    this.btnText = "Save";
    //Database Operations 
    this.dbOps = DBOps.Create;
    //bookForm
    this.bookForm = this._fb.group({
      id: [null],
      name: [""],
      category: [""],
      edition: [""],
      edition_year: [""],
      author_name: [""],
      isbn_no: [""],
      language: [""],
      keywords: [""],
      publication: [""],
      reading_age: [""],
      publication_date: [""],
      country_of_origin: [""],
      paperback: [""],
      created_by: [""],
      updated_by: [""]
    });
  }

  //SaveAndUpdateBook
  SaveAndUpdateBook() {
    //submission is true 
    this.isSubmit = true
    console.log(this.bookForm.value);
  }

}
