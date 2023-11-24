import {Component, OnInit} from '@angular/core';
import {LocalStorageService} from "../_shared/services/local-storage.service";
import {IUser} from "../interfaces/i-user";
import {Gender, STATUS_ACTIVE} from "../constants/User";
import {UserCollectionService} from "../services/user/user-collection.service";
import {AlertController, ModalController} from "@ionic/angular";
import {LocationPage} from "../_shared/pages/location/location.page";
import {Router} from "@angular/router";
import {geohashForLocation} from 'geofire-common';
import {TranslateService} from "@ngx-translate/core";
import {CameraService} from "../_shared/services/camera.service";
import {UploadService} from "../_shared/services/upload.service";

@Component({
  selector: 'app-register-steps',
  templateUrl: './register-steps.page.html',
  styleUrls: ['./register-steps.page.scss'],
})
export class RegisterStepsPage implements OnInit {

  user: Partial<IUser> = {};
  categories: any[] = [];
  genders: { key: Gender, value: string }[] = [
    {key: Gender.Male, value: 'MALE'},
    {key: Gender.Female, value: 'FEMALE'},
    {key: Gender.Transsexual, value: 'TRANSSEXUAL'}
  ]
  maxDate: any = new Date(new Date().setFullYear(new Date().getFullYear() -18)).toISOString();
  previewImage: string;

  constructor(private localStorage: LocalStorageService, private userCollectionService: UserCollectionService,
              private modalCtrl: ModalController, private router: Router, private translateService: TranslateService,
              private alertCtrl: AlertController, private cameraService: CameraService, private uploadService: UploadService) {
    this.localStorage.getUser().then((user) => {
      if (user) {
        this.user = user;
      }
    });
  }

  ngOnInit() {
  }

  log() {
    console.log(this.user);
  }

  getPicture() {
    this.cameraService.getPicture().then((base64: string) => this.previewImage = base64);
  }

  selectGender(gender: Gender) {
    this.user.gender = gender;

    this.userCollectionService.getAll(10,null,[{
      key: "genders",
      opr: 'array-contains',
      value: this.user.gender
    }], undefined, 'UserCategories').then((result) => {
      this.categories = result;
    });
  }

  selectGenderFor(gender: Gender) {
    if (!this.user.genderLookingFor) {
      this.user.genderLookingFor = [];
    }

    if (this.user.genderLookingFor.includes(gender)) {
      this.user.genderLookingFor.splice(this.user.genderLookingFor.indexOf(gender), 1);
    } else {
      this.user.genderLookingFor.push(gender);
    }
  }

  onGenderChange() {
    if (this.user.gender) {
      this.userCollectionService.getAll(10, null, [{
        key: "genders",
        opr: 'array-contains',
        value: this.user.gender
      }], undefined, 'UserCategories').then((result) => {
        this.categories = result;
      });
    }
  }

  async showLocations() {
    const modal = await this.modalCtrl.create({
      component: LocationPage
    });

    modal.onDidDismiss().then((result) => {
      if (result.data) {
        this.user.location = {
          location: result.data.location.description,
          placeId: result.data.placeId
        }

        this.user.currentLocation = {
          lat: result.data.lat,
          lng: result.data.lng,
          hash: geohashForLocation([result.data.lat, result.data.lng])
        };
      }
    })

    return modal.present();
  }

  async register() {
    console.log(this.user);
    this.user.status = STATUS_ACTIVE;

    await this.userCollectionService.set(this.user.id, this.user);
    await this.localStorage.setUser((<IUser>this.user));

    return this.uploadService.uploadFile(this.previewImage, this.user.id + 'profilePictures/primary').then(async (pictures: any) => {
      this.user.profilePictures = pictures;
      this.user.profilePictures.uploadAt = Date.now();

      await this.userCollectionService.set(this.user.id, this.user);

      return this.router.navigate(['/home']);
    });
  }
}
