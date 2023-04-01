import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConstantsService {

  constructor() { }

   /******************** Variables ***************************** */

  //Base URL 
  private baseUrl = "http://localhost"
  //Port 
  private port = ":8080" 
  //url
  private url = "/webstarter/"
  //Server URL
  public SERVER_URL = this.baseUrl + this.port + this.url
  //Status - Active
  public ACTIVE = "active"
  //Status - Delete
  public DELETE = "delete"

  /************************ Functions *************************** */

  //format date 
  public formatDate(date: any): string {
    //Parse Date 
    var parse_date = new Date(date);
    //Day
    var day = parse_date.getDate() + "-" + (parse_date.getMonth() + 1) + "-" + parse_date.getFullYear()
    //Time 
    var time = parse_date.getHours() + ":" + parse_date.getMinutes() + ":" + parse_date.getSeconds()
    //DD-MM-YYYY
    if (day.length == 8) {
      //return date
      return "0" + day.slice(0, 1) + "-0" + day.slice(2, 3) + "-" + day.slice(4, 9) + " " + time
    } else if (day.length == 9) {
      var current_day = new Date(date)
      var d: string
      var m: string
      //day
      if (current_day.getDate().toString().length == 1) {
        d = "0" + current_day.getDate().toString()
      } else {
        d = current_day.getDate().toString()
      }
      //month
      if ((current_day.getMonth() + 1).toString().length == 1) {
        m = "0" + (current_day.getMonth() + 1).toString()
      } else {
        m = (current_day.getMonth() + 1).toString()
      }
      //return date
      return m + "-" + d + "-" + day.slice(5, 9) + " " + time
    } else {
      console.log("Parse Date --- ", parse_date, " -- ", day)
      //return date
      return day.slice(3, 5) + "-" + day.slice(0, 2) + "-" + day.slice(6, 10) + " " + time
    }
  }

}
