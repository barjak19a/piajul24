import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from './model/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:4000'; // Replace with your API endpoint

  constructor(private http: HttpClient) {}

  changePassword(username: string, currentPassword: string, newPassword: string): Observable<any> {
    const url = `${this.apiUrl}/change-password`;
    const body = { username, currentPassword, newPassword };
    return this.http.post(url, body);
  }

  getGuestUsersCount(): Observable<any> {
    const url = `${this.apiUrl}/guest-users-count`;
    return this.http.get(url);
  }

  updateUser(user: User): Observable<User> {
    const url = `${this.apiUrl}/update-profile`;
    return this.http.put<User>(url, user);
  }
}
