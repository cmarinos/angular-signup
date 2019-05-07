import {Component, OnDestroy, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {AuthData} from '../auth.model';
import {AuthService} from '../auth.service';
import {Subscription} from 'rxjs';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit,  OnDestroy {
  public authData: AuthData = new AuthData();
  private isUserAuthenticated = false;
  private authListenerSubscription: Subscription;


    constructor(private authService: AuthService) {
    }

    ngOnInit() {
        this.isUserAuthenticated = this.authService.isAuthenticated();
        this.authListenerSubscription = this.authService
            .getAuthStatusListener()
            .subscribe(response => this.isUserAuthenticated = response);
    }

    ngOnDestroy() {
        this.authListenerSubscription.unsubscribe();
    }

  onLogin(form: NgForm) {
    if (form.invalid) {
          return ;
    }

    this.authData.email = form.value.email;
    this.authData.password = form.value.password;
    this.authService.loginUser(this.authData);
  }

}
