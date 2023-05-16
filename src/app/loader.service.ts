import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  //to Store laoding
  private loading: boolean = false;

  constructor() { }

  //Set Loading 
  setLoading(loading: boolean) {
    this.loading = loading;
  }

  //Get Loading
  getLoading(): boolean {
    return this.loading;
  }

}
