import { Routes } from "@angular/router";

export const contentRoutes: Routes = [
    { path: '', loadChildren: () => import('../../components/book/book.module').then(m => m.BookModule) },
];