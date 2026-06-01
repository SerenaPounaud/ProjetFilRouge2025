import { HttpClient } from '@angular/common/http'; //requêtes
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  contactURL : string='http://localhost:3000/api/contacts'; //port backend node

  constructor(private httpClient: HttpClient){}

  // string || boolean || recipeObj + id
  sendMessage(messageObj:any){
    return this.httpClient.post(this.contactURL, messageObj);
  }
}
