import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { MainComponent } from './layout/main/main.component';
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import { SignupComponent } from './auth/signup/signup.component';
import {FormsModule, ReactiveFormsModule, NG_VALIDATORS} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {AuthInterceptor} from './auth/auth.interceptor';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {NgProgressModule} from '@ngx-progressbar/core';
import {NgProgressHttpModule} from '@ngx-progressbar/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ProfileComponent } from './user/profile/profile.component';
import {ErrorInterceptor} from './error-interceptor';
import { ErrorComponent } from './shared/error/error.component';
import {AngularMaterialModule} from './angular-material.module';
import {FlexLayoutModule} from '@angular/flex-layout';
import { ResetComponent } from './auth/reset/reset.component';
import { UpdatePasswordComponent } from './auth/update-password/update-password.component';
import {ConfirmPasswordValidatorDirective} from './shared/confirm-password.directive';
import { AccountComponent } from './user/account/account.component';
import { ProfilePhotoComponent } from './user/profile-photo/profile-photo.component';
import { UserItemsComponent } from './user/user-items/user-items.component';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MainComponent,
    HeaderComponent,
    FooterComponent,
    SignupComponent,
    ProfileComponent,
    ErrorComponent,
    ResetComponent,
    UpdatePasswordComponent,
    ConfirmPasswordValidatorDirective,
    AccountComponent,
    ProfilePhotoComponent,
    UserItemsComponent,
    LiveSalesListComponent,
    LiveSalesDetailsComponent,
    LotsListComponent,
    LotsDetailsComponent,
    StaticSalesListComponent,
    StaticSalesDetailsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgProgressModule,
    NgProgressHttpModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    FlexLayoutModule
  ],
  providers: [
      { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
      { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
      ],
  bootstrap: [AppComponent],
  entryComponents: [ErrorComponent]
})
export class AppModule { }
