import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../../auth/auth.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit, OnDestroy {
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

}
