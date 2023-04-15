import { Routes } from "@angular/router";

export const contentRoutes: Routes = [
    { path: 'books', loadChildren: () => import('../../components/book/book.module').then(m => m.BookModule) },
    { path: 'user', loadChildren: () => import('../../components/userprofile/userprofile.module').then(m => m.UserprofileModule) },
];