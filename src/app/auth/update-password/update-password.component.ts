import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {AuthService} from '../auth.service';
import {NgForm} from '@angular/forms';
import {User} from '../../user/user.model';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.css']
})
export class UpdatePasswordComponent implements OnInit, OnDestroy {
  token: string;
  user: User;
  private userListenerSubscription: Subscription;
  formModel = this.initFormModel();

  constructor(
      private route: ActivatedRoute,
      private authService: AuthService
  ) { }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
        this.token = params.token;
      }
    );
    this.authService.getUserByToken(this.token);
    this.userListenerSubscription = this.authService
        .getUserListener().subscribe(user => {
          this.user = user;
        });
  }

  ngOnDestroy() {
    this.userListenerSubscription.unsubscribe();
  }

  initFormModel() {
    return {
      password: '',
      confirmPassword: ''
    };
  }

  updatePassword(form: NgForm) {
    const userData = {
      userId: this.user.id,
      token: this.token,
      password: form.value.password
    };
    this.authService.updateUserPassword(userData);
  }

}
