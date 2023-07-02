import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from 'src/environments/environment';
import { HttpHeaders } from '@angular/common/http';

export interface ApiResult{
  result : any[]
}
export interface ApiRequest{
  phoneNumber: string
  name: string
  surname: string
  email: string
  password: string
  category: string
  birthday: string
}
@Injectable({
  providedIn: 'root'
})


export class ContactsService {

  constructor(private http: HttpClient) { }
  getContacts() : Observable<ApiResult>{
    return this.http.get<ApiResult>(`${environment.baseUrl}`);
   }
  getContactDetails(id:string) {}
  createContact(apiRequest: ApiRequest): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
  
    return this.http.post<any>(`${environment.baseUrl}`, apiRequest, httpOptions);
  }
  editContacts(){

  }
  deleteContact(){
    
  }
}
