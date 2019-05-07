import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AuthData} from './auth.model';
import {User} from '../user/user.model';
import {Subject} from 'rxjs';
import {Router} from '@angular/router';

import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
    private isUserAuthenticated = false;
    private token: string;
    private tokenTimer: any;
    private authStatusListener  = new Subject<boolean>();
    private user: User;
    private userListener = new Subject<User>();

  constructor(private http: HttpClient, private router: Router) { }

  getToken() {
      return this.token;
  }

  getAuthStatusListener() {
      return this.authStatusListener.asObservable();
  }

  getUserListener() {
      return this.userListener.asObservable();
  }

  isAuthenticated() {
      return this.isUserAuthenticated;
  }

  getUser() {
      return this.user;
  }

  signupUser(user: User) {
    this.http.post<{user: User, token: string, expiresIn: number}>(environment.apiUrl + '/signup', user)
        .subscribe(response => {
            const token = response.token;
            if (token) {
                this.token = token;
                this.isUserAuthenticated = true;
                this.authStatusListener.next(true);
                this.user = response.user;
                this.userListener.next(response.user);
                this.router.navigate(['/']);
            }
        }, error => {
            this.authStatusListener.next(false);
        });
  }

  loginUser(authData: AuthData) {
      this.http.post<{user: User, token: string, expiresIn: number}>(environment.apiUrl + '/login', authData)
          .subscribe(response => {
              const token = response.token;
              this.token = token;
              if (token) {
                  const expiresIn = response.expiresIn;
                  this.setAuthTimer(expiresIn);
                  this.isUserAuthenticated = true;
                  this.authStatusListener.next(true);
                  const expirationDate = new Date(expiresIn);
                  this.saveAuthData(token, expirationDate);
                  this.user = response.user;
                  this.userListener.next(response.user);
                  this.router.navigate(['/']);
              }
          }, error => {
              this.authStatusListener.next(false);
          });
  }

  resetUserPassword(email: any) {
      this.http.post(environment.apiUrl + '/reset', email)
          .subscribe(response => {
              if (response) {
                  this.router.navigate(['/']);
              }
          }, error => {
              console.log(error);
          });
  }

  getUserByToken(token: string) {
      return this.http.post<User>(environment.apiUrl + '/user/token', {token: token})
          .subscribe(user => {
              if (user) {
                  this.user = user;
                  this.userListener.next(user);
              }
          }, error => {
              console.error(error);
              this.router.navigate(['/']);
          });
  }

  updateUserPassword(userData: any) {
    this.http.post(environment.apiUrl + '/update-password', userData)
        .subscribe(response => {
            if (response) {
                this.router.navigate(['/login']);
            }
        }, error => {
            console.log(error);
        });
  }

  autoAuthUser() {
      const authData = this.getAuthData();
      if (!authData) {
          return ;
      }
      const tokenExpirationDate = new Date(authData.expirationDate);
      const now = new Date();
      const expiresIn = tokenExpirationDate.getTime() - now.getTime();

      if (expiresIn > 0) {
          this.token = authData.token;
          this.isUserAuthenticated = true;
          this.setAuthTimer(expiresIn / 1000);
          this.authStatusListener.next(true);
      }
  }

  logoutUser() {
      this.token = null;
      this.isUserAuthenticated = false;
      this.authStatusListener.next(false);
      this.user = null;
      this.userListener.next(null);
      clearTimeout(this.tokenTimer);
      this.clearAuthData();
      this.router.navigate(['/']);
  }

  private setAuthTimer(duration: number) {
      this.tokenTimer = setTimeout(() => {
          this.logoutUser();
      }, duration * 1000);
  }

  private saveAuthData(token: string, expirationDate: Date) {
      localStorage.setItem('ja_token', token);
      localStorage.setItem('ja_expirationDate', expirationDate.toISOString());
  }

  private clearAuthData() {
      localStorage.removeItem('ja_token');
      localStorage.removeItem('ja_expirationDate');
  }

  private getAuthData() {
      const token = localStorage.getItem('ja_token');
      const expirationDate = localStorage.getItem('ja_expirationDate');
      if (!token || !expirationDate) {
          return ;
      }
      return {
          token: token,
          expirationDate: expirationDate
      };
  }

}
