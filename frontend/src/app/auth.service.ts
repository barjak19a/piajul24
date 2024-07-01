import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  uri = 'http://localhost:4000';

  constructor(private http: HttpClient, private router: Router) { }

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

  getCurrentUser(): any {
    const currentUserString = localStorage.getItem('currentUser');
    return currentUserString ? JSON.parse(currentUserString) : null;
  }

  isLoggedIn(): boolean {
    return !!this.getCurrentUser();
  }

  checkUserType(desiredType: string): boolean {
    const currentUser = this.getCurrentUser();
    if (!currentUser) {
      this.router.navigate(['/']);
      return false;
    }
    if (currentUser.role !== desiredType) {
      // TODO: dodati logiku gde se korisnik rutira na svoju home stranicu u zavisnosti od tipa
      this.router.navigate(['/']);
      return false;
    }
    return true;
  }
}
