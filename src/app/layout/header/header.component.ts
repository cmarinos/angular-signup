import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../../auth/auth.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
    public isUserAuthenticated = false;
    private authListenerSubscription: Subscription;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.isUserAuthenticated = this.authService.isAuthenticated();
    this.authListenerSubscription = this.authService
        .getAuthStatusListener()
        .subscribe(isAuthenticated => {
            this.isUserAuthenticated = isAuthenticated;
        });
  }

  ngOnDestroy() {
      this.authListenerSubscription.unsubscribe();
  }

  onLogout() {
      this.authService.logoutUser();
  }

}
