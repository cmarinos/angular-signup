import {Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {mimeType} from '../../shared/mime-type.validator';
import {UserService} from '../user.service';
import {AuthService} from '../../auth/auth.service';
import {UserProfile} from '../user.model';


@Component({
    selector: 'app-profile-photo',
    templateUrl: './profile-photo.component.html',
    styleUrls: ['./profile-photo.component.css']
})
export class ProfilePhotoComponent implements OnInit {
    form: FormGroup;
    profilePhotoPreview: any;
    @Input() profile: UserProfile;


    constructor(
        private authService: AuthService,
        private userService: UserService
    ) { }

    ngOnInit() {
        this.form = new FormGroup({
            profilePhoto: new FormControl(null, {
                validators: [Validators.required],
                asyncValidators: [mimeType]
            })
        });
    }

    onImagePicked(event: Event) {
        const file = (event.target as HTMLInputElement).files[0];
        if (!file) {
            return ;
        }
        this.form.patchValue({profilePhoto: file});
        this.form.get('profilePhoto').updateValueAndValidity();
        const reader = new FileReader();
        reader.onload = () => {
            this.profilePhotoPreview = reader.result;
        };
        reader.readAsDataURL(file);
    }

    saveProfilePhoto() {
        if (this.form.invalid) {
            return;
        }
        const photo = this.form.value.profilePhoto;
        this.userService.updateUserProfilePhoto(this.profile.id.toString(), photo)
            .subscribe(response => {
                if (response) {
                    this.profilePhotoPreview = null;
                    this.profile = response.userProfile;
                }
            }, error => {
                console.log(error);
            });
    }
}
