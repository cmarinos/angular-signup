import { Component, OnInit } from '@angular/core';
import {AuthService} from '../auth.service';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.css']
})
export class ResetComponent implements OnInit {

  constructor(
      private authService: AuthService
  ) { }

  ngOnInit() {
    console.log('Reset Component');
  }

  resetPassword(form: NgForm) {
    this.authService.resetUserPassword({ email: form.value.email });
  }

}
