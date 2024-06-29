import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  uri = 'http://localhost:4000';

  constructor(private http: HttpClient) { }

  login(data: any) {
    return this.http.post(`${this.uri}/login`, data);
  }
  
  adminlogin(data: any){
    return this.http.post(`${this.uri}/adminlogin`, data);
  }

  register(formData: any): Observable<any> {
    const url = `${this.uri}/register`; // Adjust endpoint as per your API design

    return this.http.post(url, formData);
  }
}
