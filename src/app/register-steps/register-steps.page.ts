import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {LocalStorageService} from "../_shared/services/local-storage.service";
import {IUser} from "../interfaces/i-user";
import {Gender, STATUS_ACTIVE} from "../constants/User";
import {UserCollectionService} from "../services/user/user-collection.service";
import {AlertController, ModalController, NavController} from "@ionic/angular";
import {LocationPage} from "../_shared/pages/location/location.page";
import {Router} from "@angular/router";
import {geohashForLocation} from 'geofire-common';
import {TranslateService} from "@ngx-translate/core";
import {CameraService} from "../_shared/services/camera.service";
import {UploadService} from "../_shared/services/upload.service";
import {deleteUser, getAuth} from "firebase/auth";
import {AbstractBase} from "../_shared/classes/AbstractBase";
import {ProfileHelper} from "../_shared/helper/Profile";
import {AvatarsComponent} from "../_shared/components/avatars/avatars.component";

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
  previewType: 'avatar' | 'folder';

  constructor(protected localStorage: LocalStorageService, private userCollectionService: UserCollectionService,
              private modalCtrl: ModalController, private router: Router, private translateService: TranslateService,
              private alertCtrl: AlertController, private cameraService: CameraService, private uploadService: UploadService,
              protected navCtrl: NavController, protected changeDetector: ChangeDetectorRef) {
    this.localStorage.getUser().then((user) => this.user = user);
  }

  ngOnInit() {
  }

  log() {
    console.log(this.user);
  }

  cancelRegistration() {
    return deleteUser(getAuth().currentUser);
  }

  getPicture() {
    this.previewType = 'folder';
    this.cameraService.getPicture().then((base64: string) => this.previewImage = base64);
  }

  selectGender(gender: Gender) {
    this.user.gender = gender;

    this.userCollectionService.getAll(20,null,[{
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
        const randomLocation = ProfileHelper.randomGeo({
          latitude: result.data.lat,
          longitude: result.data.lng
        }, 5000);

        this.user.location = {
          location: result.data.location.description,
          placeId: result.data.placeId
        }

        this.user.currentLocation = {
          lat: parseFloat(randomLocation.latitude),
          lng: parseFloat(randomLocation.longitude),
          hash: geohashForLocation([ parseFloat(randomLocation.latitude), parseFloat(randomLocation.longitude)])
        };
      }
    })

    return modal.present();
  }

  async showAvatars() {
    const modal = await this.modalCtrl.create({
      component: AvatarsComponent,
      componentProps: {
        gender: this.user.gender
      }
    });

    modal.present();

    modal.onDidDismiss().then((res) => {
      if (res.data) {
        this.previewType = 'avatar';
        this.previewImage = res.data.avatar
      }
    })
  }

  async register() {
    this.user.age = new Date(this.user.birthday).getTime();
    this.user.status = STATUS_ACTIVE;
    this.user.lastBoostAt = new Date().getTime()/1000;
    this.user._settings = {
      units: {
        lengthType: 'Inch',
        distanceType: 'Mi',
        weightType: 'Lbs'
      },
      notifications: {
        messages: true,
        friendRequests: true,
        likes: true
      },
      currentLang: this.translateService.currentLang
    };

    if (!this.user.age) {
      const alert = await this.alertCtrl.create({
        message: this.translateService.instant('YOUMUSTBE18')
      });

      return alert.present();
    }

    if (!this.user.username) {
      const alert = await this.alertCtrl.create({
        message: this.translateService.instant('ADDUSERNAME')
      });

      return alert.present();
    }

    await this.userCollectionService.set(this.user.id, this.user);
    await this.localStorage.setUser((<IUser>this.user));

    if (this.previewType === 'folder') {
      return this.uploadService.uploadFile(this.previewImage, this.user.id + '/profilePictures/primary').then(async (pictures: any) => {
        this.user.profilePictures = pictures;
        this.user.profilePictures.uploadAt = Date.now();

        await this.userCollectionService.set(this.user.id, this.user);

        return this.router.navigate(['/start-tabs']);
      });
    } else if (this.previewType === 'avatar') {
      const pictures: any = {thumbnails: {}, original: this.previewImage};
      pictures.thumbnails.small = this.previewImage;
      pictures.thumbnails.medium = this.previewImage;
      pictures.thumbnails.big = this.previewImage;

      this.user.profilePictures = pictures;
      this.user.profilePictures.uploadAt = Date.now();

      await this.userCollectionService.set(this.user.id, this.user);

      return this.router.navigate(['/start-tabs']);
    }
  }
}
