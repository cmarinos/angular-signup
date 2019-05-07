import {Component, Input, OnInit} from '@angular/core';
import {AuthService} from '../../auth/auth.service';
import {NgForm} from '@angular/forms';
import {MatSnackBar} from '@angular/material';
import {UserService} from '../user.service';
import {User, UserProfile} from '../user.model';

export interface Country {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  @Input() profile: UserProfile;
  countries: Country[];


  constructor(
      private authService: AuthService,
      private userService: UserService,
      private snackBar: MatSnackBar
  ) {
    this.countries = [
      {value: 'USA', viewValue: 'United States'},
      {value: 'CANADA', viewValue: 'Canada'},
      {value: 'MEXICO', viewValue: 'Mexico'}
    ];
  }

  ngOnInit() {
  }

  updateProfile(form: NgForm) {
    this.profile.firstname = form.value.firstname;
    this.profile.lastname = form.value.lastname;
    this.profile.company = form.value.company;
    this.profile.phone = form.value.phone;
    this.profile.mobilePhone = form.value.mobilePhone;
    this.profile.newsletter = form.value.newsletter;
    this.profile.addressOne = form.value.addressOne;
    this.profile.addressTwo = form.value.addressTwo;
    this.profile.city = form.value.city;
    this.profile.region = form.value.region;
    this.profile.postcode = form.value.postcode;
    this.profile.country = form.value.country;

    this.userService.updateUserProfile(this.profile)
        .subscribe(response => {
          if (response) {
            this.snackBar.open('Profile Updated Successfully', 'OK', {
              duration: 2000
            });
          }
        }, err => {
          console.log(err);
        });
  }

}
