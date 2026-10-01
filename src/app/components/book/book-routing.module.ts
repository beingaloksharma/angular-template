import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BooksComponent } from './books/books.component';
import { BookComponent } from './book/book.component';
import { CreateBookComponent } from './create-book/create-book.component';
import { RoleGuard } from 'src/app/shared/services/role.guard';

const routes: Routes = [
  {
    path: '', children: [
      { path: '', component: BooksComponent },
      { path: 'book/:id', component: BookComponent },
      {
        path: 'create',
        component: CreateBookComponent,
        canActivate: [RoleGuard],
        data: {
          minRole: 'admin',
          resourceName: 'Create Book (Admin Tier)'
        }
      },
      {
        path: 'update/:id',
        component: CreateBookComponent,
        canActivate: [RoleGuard],
        data: {
          minRole: 'admin',
          resourceName: 'Edit Book (Admin Tier)'
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BookRoutingModule { }
