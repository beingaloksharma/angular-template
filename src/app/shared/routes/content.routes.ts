import { Routes } from "@angular/router";

export const contentRoutes: Routes = [
    { path: 'book', loadChildren: () => import('../../components/book/book.module').then(m => m.BookModule) },
];