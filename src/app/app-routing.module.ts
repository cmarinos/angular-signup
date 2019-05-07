import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginComponent} from './auth/login/login.component';
import {MainComponent} from './layout/main/main.component';
import {SignupComponent} from './auth/signup/signup.component';
import {AuthGuard} from './auth/auth.guard';
import {ProfileComponent} from './user/profile/profile.component';
import {ResetComponent} from './auth/reset/reset.component';
import {UpdatePasswordComponent} from './auth/update-password/update-password.component';
import {AccountComponent} from './user/account/account.component';

const routes: Routes = [
  { path: '', redirectTo: '/main', pathMatch: 'full' },
  { path: 'main', component: MainComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'reset-password', component: ResetComponent },
  { path: 'update-password/:token', component: UpdatePasswordComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'account', component: AccountComponent, canActivate: [AuthGuard] },
  { path: 'auctions', children: [
      { path: 'live-sales', component: LiveSalesListComponent },
      { path: 'live-sale/:id', component: LiveSalesDetailsComponent },
      { path: 'static-sales', component: StaticSalesListComponent },
      { path: 'static-sale/:id', component: StaticSalesDetailsComponent },
      { path: 'sale/lot/:id', component: LotsDetailsComponent }
    ] },
  { path: '**', redirectTo: '/main' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
    providers: [AuthGuard]
})
export class AppRoutingModule { }
