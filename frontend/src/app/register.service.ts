import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  private apiUrl = 'http://localhost:4000'; // Replace with your API endpoint

  constructor(private http: HttpClient) { }

  register(formData: any): Observable<any> {
    const url = `${this.apiUrl}/register`; // Adjust endpoint as per your API design

    return this.http.post(url, formData);
  }
}
