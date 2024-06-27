import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  uri = 'http://localhost:4000';

  constructor(private http: HttpClient) { }

  login(data: any) {
    return this.http.post(`${this.uri}/login`, data);
  }
}
