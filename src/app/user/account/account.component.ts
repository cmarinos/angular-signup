import { Component, OnInit } from '@angular/core';
import {User, UserProfile} from '../user.model';
import {Subscription} from 'rxjs';
import {AuthService} from '../../auth/auth.service';
import {UserService} from '../user.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  user: User = new User();
  userProfile: UserProfile = new UserProfile();
  private userListener: Subscription;

  constructor(
      private authService: AuthService,
      private userService: UserService
  ) { }

  ngOnInit() {
    this.user = this.authService.getUser();
    this.userListener = this.authService
        .getUserListener()
        .subscribe(user => {
          this.user = user;
        });
    this.userService.getUserProfile(this.user.id)
        .subscribe(response => {
          this.userProfile = _.find(response.userProfile, { 'userId': this.user.id });
        }, error => {
          console.log(error);
        });
  }

}
