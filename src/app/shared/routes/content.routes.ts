import { Routes } from "@angular/router";

export const contentRoutes: Routes = [
    { path: 'books', loadChildren: () => import('../../components/book/book.module').then(m => m.BookModule) },
];