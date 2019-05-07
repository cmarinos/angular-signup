import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../auth.service';
import {User} from '../../user/user.model';
import {NgForm} from '@angular/forms';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {
    user: User;
    isUserAuthenticated = false;
    private authListenerSubscription: Subscription;
    formModel = this.initFormModel();


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

    initFormModel() {
        return {
            email: '',
            password: '',
            confirmPassword: ''
        };
    }

    onSignup(form: NgForm) {
        if (form.invalid) {
            return ;
        }
        this.user = new User();
        this.user.email = form.value.email;
        this.user.password = form.value.password;
        this.authService.signupUser(this.user);
    }

}
