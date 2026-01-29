import { ToastrService } from 'ngx-toastr';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DBOps } from 'src/app/shared/DBOps/dbops';
import { Book, Keywords, Languages } from 'src/app/shared/models/book';
import { CommonService } from 'src/app/shared/services/common.service';
import { ConstantsService } from 'src/app/shared/services/constants.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-create-book',
  templateUrl: './create-book.component.html',
  styleUrls: ['./create-book.component.css']
})
export class CreateBookComponent implements OnInit {
  //To Store Countries 
  countries: string[] = [];
  //To Store Publications
  publications: string[] = [];
  //To store keyboards
  keywords: Keywords[] = [];
  //Book Category
  categories: string[] = ["Health, Family & Personal Development", "Literature & Fiction", "Analysis & Strategy", "Sciences, Technology & Medicine", "Children's Early Learning", "New Age & Spirituality"]
  //Edition
  editions: string[] = ["First", "Second", "Third", "Fourth", "Fifth"]
  //language
  languages: Languages[] = [];
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
  //minimum date
  minDate = new Date(2000, 0, 1);
  //maximum date
  maxDate = new Date();

  //Constructor 
  constructor(
    private _fb: FormBuilder,
    private _constants: ConstantsService,
    private _commonService: CommonService,
    private _toastr: ToastrService,
    private _router: Router,
    private _route: ActivatedRoute
  ) {

    //To Get param value 
    this._route.params.subscribe((res: any) => {
      //check param id value 
      if (res['id'] === undefined) {
        this._router.navigate(['/books/create']);
      } else {
        //Load in browser
        this.getBookDetailsForUpdate(res['id']);
      }
    })

    //Get Languages 
    this._commonService.get(this._constants.SERVER_URL + "languages").subscribe((res: Languages[]) => {
      this.languages = res;
    });

    //Get Keywords 
    this._commonService.get(this._constants.SERVER_URL + "keywords").subscribe((res: Keywords[]) => {
      this.keywords = res;
    });

    //Get Countires 
    this._commonService.get(this._constants.SERVER_URL + "countries").subscribe((res: string[]) => {
      this.countries = res;
    });

    //Get Publications 
    this._commonService.get(this._constants.SERVER_URL + "publications").subscribe((res: string[]) => {
      this.publications = res;
    });

  }

  //ngOnInit
  ngOnInit(): void {
    //Initialize Book
    this.setInitiaState();
  }

  //Add Language 
  addLanguagesFn(language) {
    return { 'language': language };
  }

  //Add Keyword 
  addKeywordsFn(keyword) {
    return { 'keyword': keyword };
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
      name: ["", Validators.compose([Validators.required])],
      category: ["", Validators.compose([Validators.required])],
      edition: ["", Validators.compose([Validators.required])],
      author_name: ["", Validators.compose([Validators.required])],
      isbn_no: ["", Validators.compose([Validators.required])],
      languages: ["", Validators.compose([Validators.required])],
      keywords: ["", Validators.compose([Validators.required])],
      publication: ["", Validators.compose([Validators.required])],
      reading_age: [""],
      publication_date: ["", Validators.compose([Validators.required])],
      country_of_origin: ["", Validators.compose([Validators.required])],
      paperback: [""]
    });
  }

  //SaveAndUpdateBook
  SaveAndUpdateBook() {
    //submission is true 
    this.isSubmit = true

    if (this.bookForm.invalid) {
      this.bookForm.markAllAsTouched();
      return;
    }

    if (this.bookForm.valid) {
      //check button action
      switch (this.dbOps) {
        case DBOps.Create:
          //set data to form 
          this.payload = {
            id: null,
            tenant_id: 1,
            name: this.bookForm.value['name'],
            author_name: this.bookForm.value['author_name'],
            category: this.bookForm.value['category'],
            reading_age: this.bookForm.value['reading_age'].toString(),
            edition: this.bookForm.value['edition'],
            publication_date: this.bookForm.value['publication_date'],
            isbn_no: this.bookForm.value['isbn_no'],
            publication: this.bookForm.value['publication'],
            country_of_origin: this.bookForm.value['country_of_origin'],
            paperback: +this.bookForm.value['paperback'],
            languages: this.bookForm.value['languages'],
            keywords: this.bookForm.value['keywords'],
            status: this._constants.ACTIVE,
            created_by: JSON.parse(localStorage.getItem('userdetails')).name,
          }
          //call service
          this._commonService.post(this._constants.SERVER_URL + 'book', this.payload).subscribe((res: any) => {
            //Set Loader true 
            this.loading = true;
            setTimeout(() => {
              //Set Loader false 
              this.loading = false;
              //Reset the form in Initial state 
              this.onReset();
              //Promt success message
              this._toastr.success("Book record added sucessfully");
              //redirect to home page 
              this._router.navigate(['/books']);
            }, 1000)
          },
            (error: HttpErrorResponse) => {
              switch (error.error.error_code) {
                case error.error.error_code: {
                  this._toastr.error(error.error.error_message);
                  break;
                }
                default: {
                  this._toastr.error("Something went wrong");
                  break;
                }
              }
            }
          );
          break;
        case DBOps.Update:
          //set data to form 
          this.payload = {
            id: this.bookForm.value['id'],
            tenant_id: 1,
            name: this.bookForm.value['name'],
            author_name: this.bookForm.value['author_name'],
            category: this.bookForm.value['category'],
            reading_age: this.bookForm.value['reading_age'].toString(),
            edition: this.bookForm.value['edition'],
            publication_date: this.bookForm.value['publication_date'],
            isbn_no: this.bookForm.value['isbn_no'],
            publication: this.bookForm.value['publication'],
            country_of_origin: this.bookForm.value['country_of_origin'],
            paperback: +this.bookForm.value['paperback'],
            languages: this.bookForm.value['languages'],
            keywords: this.bookForm.value['keywords'],
            status: this._constants.ACTIVE,
            updated_by: JSON.parse(localStorage.getItem('userdetails')).name,
          }
          //call service
          this._commonService.put(this._constants.SERVER_URL + 'book', this.payload).subscribe((res: any) => {
            //Set Loader true 
            this.loading = true;
            setTimeout(() => {
              //Set Loader false 
              this.loading = false;
              //Reset the form in Initial state 
              this.onReset();
              //Promt success message
              this._toastr.success("User record updated sucessfully");
              //redirect to home page 
              this._router.navigate(['/books/book/', this.payload.id]);
            }, 1000)
          },
            (error: HttpErrorResponse) => {
              switch (error.error.error_code) {
                case error.error.error_code: {
                  this._toastr.error(error.error.error_message);
                  break;
                }
                default: {
                  this._toastr.error("Something went wrong");
                  break;
                }
              }
            }
          );
          break;
      }
    }
  }

  //Control Name 
  get ctrl() {
    return this.bookForm.controls;
  }

  //Reset the Book form 
  onReset() {
    this.btnText = "Save";
    //Reset Form 
    this.bookForm.reset();
    //Reset Database Operation
    this.dbOps = DBOps.Create;
  }

  //getBookDetailsForUpdate
  private getBookDetailsForUpdate(id: number) {
    //call service 
    this._commonService.get(this._constants.SERVER_URL + 'book/' + id).subscribe((res: any) => {
      //Loading true
      this.loading = true
      setTimeout(() => {
        //Set Value to bookForm
        this.bookForm.patchValue(res);
        //Set btnAction 
        this.btnText = "Update";
        //Set DbOps
        this.dbOps = DBOps.Update;
        //Loading false
        this.loading = false;
      }, 1000);
    },
      (error: HttpErrorResponse) => {
        switch (error.status) {
          case 400: {
            this._toastr.error("Bad request");
            break;
          }
          case 404: {
            this._toastr.error("Record not found");
            this.loading = true
            setTimeout(() => {
              this._router.navigate(['/books']);
              this.loading = false;
            }, 3000);
            break;
          }
          case 500: {
            this._toastr.error("Internal Server Error");
            break;
          }
          default: {
            this._toastr.error("Something went wrong");
            break;
          }
        }
      }
    )
  }

  //Format Slider Label
  formatLabel(value: number): string {
    return `${value}`;
  }

}
