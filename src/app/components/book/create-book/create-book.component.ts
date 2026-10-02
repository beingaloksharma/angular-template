import { ToastrService } from 'ngx-toastr';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DBOps } from 'src/app/shared/DBOps/dbops';
import { Book, Keywords, Languages } from 'src/app/shared/models/book';
import { CommonService } from 'src/app/shared/services/common.service';
import { ConstantsService } from 'src/app/shared/services/constants.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { RbacService } from 'src/app/shared/services/rbac.service';
import { RbacPromptService } from 'src/app/shared/services/rbac-prompt.service';

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

  constructor(
    private _fb: FormBuilder,
    private _constants: ConstantsService,
    private _commonService: CommonService,
    private _toastr: ToastrService,
    private _router: Router,
    private _route: ActivatedRoute,
    public rbacService: RbacService,
    private rbacPrompt: RbacPromptService
  ) {

    //To Get param value 
    this._route.params.subscribe((res: any) => {
      if (res['id']) {
        this.getBookDetailsForUpdate(res['id']);
      }
    });

    //Get Languages 
    this._commonService.get(this._constants.SERVER_URL + "languages").subscribe({
      next: (res: Languages[]) => {
        this.languages = (res && res.length > 0) ? res : [
          { language: 'English' }, { language: 'Spanish' }, { language: 'French' }, 
          { language: 'German' }, { language: 'Hindi' }, { language: 'Japanese' }
        ];
      },
      error: () => {
        this.languages = [{ language: 'English' }, { language: 'Spanish' }, { language: 'French' }];
      }
    });

    //Get Keywords 
    this._commonService.get(this._constants.SERVER_URL + "keywords").subscribe({
      next: (res: Keywords[]) => {
        this.keywords = (res && res.length > 0) ? res : [
          { keyword: 'Technology' }, { keyword: 'Software' }, { keyword: 'Architecture' }, 
          { keyword: 'Science' }, { keyword: 'Leadership' }, { keyword: 'Fiction' }
        ];
      },
      error: () => {
        this.keywords = [{ keyword: 'Technology' }, { keyword: 'Software' }];
      }
    });

    //Get Countries 
    this._commonService.get(this._constants.SERVER_URL + "countries").subscribe({
      next: (res: string[]) => {
        this.countries = (res && res.length > 0) ? res : [
          'United States', 'United Kingdom', 'India', 'Germany', 'Canada', 'Australia', 'Japan', 'France'
        ];
      },
      error: () => {
        this.countries = ['United States', 'United Kingdom', 'India'];
      }
    });

    //Get Publications 
    this._commonService.get(this._constants.SERVER_URL + "publications").subscribe({
      next: (res: string[]) => {
        this.publications = (res && res.length > 0) ? res : [
          'O\'Reilly Media', 'Pearson Education', 'McGraw-Hill', 'Penguin Random House', 'HarperCollins', 'MIT Press'
        ];
      },
      error: () => {
        this.publications = ['O\'Reilly Media', 'Pearson Education', 'McGraw-Hill'];
      }
    });

  }

  //ngOnInit
  ngOnInit(): void {
    if (!this.rbacService.hasRole('admin')) {
      this.rbacPrompt.showAccessDenied({
        requiredRole: 'admin',
        currentRole: this.rbacService.getCurrentRole(),
        resourceName: 'Book Authoring Page',
        actionName: 'Access Create/Edit Book Form',
        message: 'Under the Swagger RBAC specification, standard Users cannot create or update books. Please sign in as an Admin.'
      });
      this._router.navigate(['/books']);
      return;
    }
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
      name: ["", Validators.compose([
        Validators.required,
        Validators.minLength(3)
      ])],
      category: ["", Validators.compose([Validators.required])],
      edition: ["", Validators.compose([Validators.required])],
      author_name: ["", Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z .]*$')
      ])],
      isbn_no: ["", Validators.compose([
        Validators.required,
        Validators.pattern('^[0-9-]*$'),
        Validators.minLength(10)
      ])],
      languages: ["", Validators.compose([Validators.required])],
      keywords: ["", Validators.compose([Validators.required])],
      publication: ["", Validators.compose([Validators.required])],
      reading_age: [""],
      publication_date: ["", Validators.compose([Validators.required])],
      country_of_origin: ["", Validators.compose([Validators.required])],
      paperback: ["", Validators.compose([
        Validators.pattern('^[0-9]*$')
      ])]
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
          this.loading = true;
          this._commonService.post(this._constants.SERVER_URL + 'book', this.payload).subscribe({
            next: () => {
              this.loading = false;
              this.onReset();
              this._toastr.success("Book record added successfully");
              this._router.navigate(['/books']);
            },
            error: (error: HttpErrorResponse) => {
              this.loading = false;
              this._toastr.error(error.error?.error_message || "Something went wrong adding book");
            }
          });
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
          this.loading = true;
          this._commonService.put(this._constants.SERVER_URL + 'book', this.payload).subscribe({
            next: () => {
              this.loading = false;
              this.onReset();
              this._toastr.success("Book record updated successfully");
              this._router.navigate(['/books/book/', this.payload.id]);
            },
            error: (error: HttpErrorResponse) => {
              this.loading = false;
              this._toastr.error(error.error?.error_message || "Something went wrong updating book");
            }
          });
          break;
      }
    }
  }

  //Control Name 
  get ctrl() {
    return this.bookForm.controls;
  }

  //Form Completion Percentage for visual feedback
  get formCompletionPercentage(): number {
    if (!this.bookForm) return 0;
    const requiredFields = ['name', 'author_name', 'category', 'edition', 'isbn_no', 'publication', 'publication_date', 'country_of_origin', 'languages', 'keywords'];
    let filled = 0;
    for (const field of requiredFields) {
      const val = this.bookForm.get(field)?.value;
      if (Array.isArray(val) && val.length > 0) {
        filled++;
      } else if (val !== null && val !== undefined && val !== '') {
        filled++;
      }
    }
    return Math.round((filled / requiredFields.length) * 100);
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
    this.loading = true;
    this._commonService.get(this._constants.SERVER_URL + 'book/' + id).subscribe({
      next: (res: any) => {
        this.bookForm.patchValue(res);
        this.btnText = "Update";
        this.dbOps = DBOps.Update;
        this.loading = false;
      },
      error: (error: HttpErrorResponse) => {
        this.loading = false;
        this._toastr.error(error.error?.error_message || "Record not found");
        if (error.status === 404) {
          this._router.navigate(['/books']);
        }
      }
    });
  }

  //Format Slider Label
  formatLabel(value: number): string {
    return `${value}`;
  }

}
