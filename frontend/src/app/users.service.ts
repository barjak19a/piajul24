import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from './model/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:4000'; // Replace with your API endpoint
  private currentUserSubject!: BehaviorSubject<User | null>;
  public currentUser!: Observable<User | null>;

  constructor(private http: HttpClient) {
    const storedUser = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<User | null>(storedUser ? JSON.parse(storedUser) : null);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  public setCurrentUser(user: User | null): void {
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('currentUser');
    }
    this.currentUserSubject.next(user);
  }

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

  getGuestUsers(filter: { status: string }): Observable<User[]> {
    const url = `${this.apiUrl}/guest-users`;
    return this.http.post<User[]>(url, filter);
  }

  approveUser(username: string): Observable<any> {
    const url = `${this.apiUrl}/users/approve/${username}`;
    return this.http.put(url, {});
  }

  denyUser(username: string): Observable<any> {
    const url = `${this.apiUrl}/users/deny/${username}`;
    return this.http.put(url, {});
  }

  checkUserAlreadyExists(username: string, email: string): Observable<User> {
    let data = {
      username: username,
      email: email
    };
    return this.http.post<User>(`${this.apiUrl}/users/check-existence`, data);
  }

  getUsersOfTypeGuest(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users?role=guest&status=approved`);
  }
}
