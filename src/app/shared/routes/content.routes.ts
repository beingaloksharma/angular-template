import { Routes } from "@angular/router";

export const contentRoutes: Routes = [
    { path: 'user', loadChildren: () => import('../../components/myprofile/myprofile.module').then(m => m.MyprofileModule) },
    { path: 'books', loadChildren: () => import('../../components/book/book.module').then(m => m.BookModule) },
];
