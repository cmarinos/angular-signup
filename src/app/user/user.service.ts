import { Injectable } from '@angular/core';
import {User} from './user.model';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';

import {environment} from '../../environments/environment';
import {AuthService} from '../auth/auth.service';
import {UserProfile} from './user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
    private user: User;

    constructor(
        private http: HttpClient,
        private router: Router,
        private authService: AuthService) {
    }


    getUser(userId: string) {
        this.http.get<User>(environment.apiUrl + '/user/' + userId)
            .subscribe(user => {
              console.log(user);
                this.user = user;
                this.router.navigate(['/profile']);
            });
    }

    getUserProfile(userId: number) {
        return this.http.get<{userProfile: UserProfile}>(environment.apiUrl + '/user-profile/' + userId);
    }

    updateUserProfile(userProfile: UserProfile) {
        return this.http.post<{userProfile: UserProfile, message: string}>(environment.apiUrl + '/user-profile', {profile: userProfile});
    }

    updateUserProfilePhoto(profileId: string, image: File) {
        const postData = new FormData();
        postData.append('profileId', profileId);
        postData.append('profilePhoto', image);
        return this.http.post<{userProfile: UserProfile}>(environment.apiUrl + '/user-profile-photo', postData);
    }
}
