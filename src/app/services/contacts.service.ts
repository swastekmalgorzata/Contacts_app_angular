import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import {environment} from 'src/environments/environment';
import { HttpHeaders } from '@angular/common/http';


export interface ApiResult{
  result : any[]
}
export interface ApiRequest{
  phoneNumber: string
  name: string|null
  surname: string|null
  email: string|null
  category: string|null
  birthday: string|null
}


@Injectable({
  providedIn: 'root'
})



export class ContactsService {

  constructor(private http: HttpClient) { }




  getContacts() : Observable<ApiResult>{
    return this.http.get<ApiResult>(`${environment.baseUrl}`);
   }

  getContactDetails(id:string) : Observable<ApiResult> {
    return this.http.get<ApiResult>(`${environment.baseUrl}`+'/'+id);
  }

  

  createContact(apiRequest: ApiRequest): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json',
      'Accept':'*/*',
       }),
     
    };
    return this.http.post<any>(`${environment.baseUrl}`, apiRequest, httpOptions).pipe(
      catchError((error, caught) => {
        console.error('catchError', error);
        return throwError(() => new Error('Something bad happened; please try again later.')
        );
      })
    );
  
  }


  editContacts(id:string, apiRequest: ApiRequest) {
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json',
      'Accept':'*/*',
      'Access-Control-Allow-Origin':'*'
    }),
    };
    
    console.log(apiRequest)
    return this.http.put<any>(`${environment.baseUrl}`+'/'+id,  apiRequest, httpOptions).pipe(
      catchError((error, caught) => {
        console.error('catchError', error);
        return throwError(() => new Error('Something bad happened; please try again later.')
        );
      })
    );
  }


  deleteContact(id:string) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json',
      'Accept':'*/*',
      'Access-Control-Allow-Origin':'*'
    }),
    };
    return this.http.delete<any>(`${environment.baseUrl}`+'/'+id).pipe(
      catchError((error, caught) => {
        console.error('catchError', error);
        return throwError(() => new Error('Something bad happened; please try again later.')
        );
      })
    );
  }

  

  


}
