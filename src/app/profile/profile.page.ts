import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {IUser} from "../interfaces/i-user";
import {ActivatedRoute, Router} from "@angular/router";
import {LocationService} from "../_shared/services/location.service";
import {DistanceHelper} from "../_shared/helper/Distance";
import {Ethnicity, Gender, Languages, Membership} from "../constants/User";
import {ActionSheetController, ModalController, NavController, ToastController} from "@ionic/angular";
import {EditComponent} from "./components/edit/edit.component";
import {TranslateService} from "@ngx-translate/core";
import {CountriesService} from "../_shared/services/countries.service";
import {LocalStorageService} from "../_shared/services/local-storage.service";
import {Distance} from "../constants/Units";
import {UserService} from "../services/user/user.service";
import {UserCollectionService} from "../services/user/user-collection.service";
import {NotificationService} from "../_shared/services/notification.service";
import {ProfileHelper} from "../_shared/helper/Profile";
import {getAuth, sendEmailVerification} from "firebase/auth";
import {environment} from "../../environments/environment";
import {CameraService} from "../_shared/services/camera.service";
import { SwiperContainer } from 'swiper/element';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  @ViewChild('publicImagesSlides') swiperRef: ElementRef;
  @Input() user: IUser;
  @Input() me: IUser;
  distance: string;
  currentCity: string;
  contentState: string = 'PROFILE';
  profileDetails = ['ethnicity', 'nationality', 'weight', 'height', 'chest', 'waist', 'hips', 'eyeColor', 'hairColor', 'hairLength'];

  genders: { key: Gender, value: string }[] = [
    {key: Gender.Male, value: 'MALE'},
    {key: Gender.Female, value: 'FEMALE'},
    {key: Gender.Transsexual, value: 'TRANSSEXUAL'}
  ]
  ethnicities: { key: Ethnicity, value: string }[] = [
    {key: Ethnicity.Asian, value: 'ASIAN'},
    {key: Ethnicity.Exotic, value: 'EXOTIC'},
    {key: Ethnicity.Ebony, value: 'EBONY'},
    {key: Ethnicity.Caucasian, value: 'CAUCASIAN'},
    {key: Ethnicity.MiddleEast, value: 'MIDDLEEAST'},
    {key: Ethnicity.NativeAmerican, value: 'NATIVEAMERICAN'},
    {key: Ethnicity.Latin, value: 'LATIN'},
    {key: Ethnicity.Eastindian, value: 'EASTINDIAN'},
  ]
  languages: { key: Languages, value: string }[] = [
    {key: Languages.Arabic, value: 'ARABIC'},
    {key: Languages.Chinese, value: 'CHINESE'},
    {key: Languages.English, value: 'ENGLISH'},
    {key: Languages.French, value: 'FRENCH'},
    {key: Languages.Hindi, value: 'HINDI'},
    {key: Languages.German, value: 'GERMAN'},
    {key: Languages.Japanese, value: 'JAPANESE'},
    {key: Languages.Portuguese, value: 'PORTUGUESE'},
    {key: Languages.Russian, value: 'RUSSIAN'},
    {key: Languages.Spanish, value: 'SPANISH'}
  ];
  countries: { country: string, key: string, region: string, flag: string }[] = [];
  settings: any = {};
  observer: any;
  userId: string;

  constructor(private router: Router, private locationService: LocationService, private modalCtrl: ModalController,
              private translateService: TranslateService, private countriesService: CountriesService, private localStorage: LocalStorageService,
              private navCtrl: NavController, private route: ActivatedRoute, private userService: UserService,
              private actionSheetCtrl: ActionSheetController, private userCollectionService: UserCollectionService,
              private notificationService: NotificationService, private toastCtrl: ToastController, private cameraService: CameraService) {
  }

  ngOnInit() {
    return this.initUser();
  }

  async initUser() {
    await this.localStorage.getUser().then((user) => this.me = user);

    this.route.paramMap.subscribe((map) => {
      const lang = map.get('lang');
      const country = map.get('country');
      const city = map.get('city');
      const userId = map.get('userId');
      const federaleState = map.get('federaleState');
      this.userId = userId;

      this.userService.getUserByQueryParams(userId, city, country, federaleState, null, true, (snapshot) => {
        const user = snapshot.data();

        if (!this.me._gotBlockedFrom?.includes(userId)) {
          this.user = user;

          setTimeout(() => {
            this.swiperRef.nativeElement.swiper.update();
            this.swiperRef.nativeElement.swiper.slideNext(0);
          }, 300);
        }

        this.init();
      }).then((observer: any) => {
        this.observer = observer;

        setTimeout(() => {
          if (lang && ['de', 'en', 'es', 'fr'].includes(lang.toLowerCase())) {
            this.translateService.use(lang.toLowerCase());
          }
        }, 300);
      });
    })

  }

  swiperReady(swiperContainer: SwiperContainer): void {
    console.log(swiperContainer);
    console.log('init');
  }

  addEvents() {
    document.addEventListener('user', (e: any) => {
      this.me = e.detail.user;

      if (this.user && this.me._gotBlockedFrom?.includes(this.user.id)) {
        this.user = null;
      }
    })
  }

  openTel(phoneNumber: string) {
    window.open('tel:' + phoneNumber);
  }

  init() {
    this.addEvents();

    if (this.user) {
      const distance = parseFloat(DistanceHelper.calcDistance(
        this.me.currentLocation.lat,
        this.me.currentLocation.lng,
        this.user.currentLocation.lat,
        this.user.currentLocation.lng,
        5
      ));

      if (this.me._settings.units.distanceType === Distance.Mi) {
        this.distance = DistanceHelper.kmToMiles(distance) > 99 ? '>99Mi' : DistanceHelper.kmToMiles(distance).toFixed(1) + 'Mi';
      } else {
        this.distance = distance > 99 ? '>99Km' : ((<number>distance) > 0 ? (<number>distance).toFixed(1) : distance) + 'Km';
      }
      this.locationService.getCityFromLatLng(
        this.user.currentLocation.lat,
        this.user.currentLocation.lng
      ).then((formatAddress: any) => {
        this.currentCity = formatAddress[0].locality + ', ' + formatAddress[0].state;
      });
    }

    this.countriesService.getAll().then(countries => this.countries = countries);
  }

  ngAfterViewInit() {

  }

  changeContentState(state: string) {
    this.contentState = state;
  }

  detailExists(key: string) {
    if (this.user?.details && this.user?.details[key]) {
      return true;
    }

    return false;
  }

  getDetail(key: string) {
    const detail = this.user.details[key];

    if (key === 'ethnicity') {
      for (let ethnicity of this.ethnicities) {
        if (detail === ethnicity.key) {
          return this.translateService.instant(ethnicity.value);
        }
      }
    } else if (key === 'nationality') {
      for (let country of this.countries) {
        if (detail.code === country.key) {
          return country.country;
        }
      }
    } else if (['height', 'waist', 'hips', 'chest'].includes(key)) {
      let d = this.me._settings.units.lengthType === 'Inch' ? Math.round(this.user.details[key].inch) + ' inch' : Math.round(this.user.details[key].cm) + ' cm';

      if (key === 'chest' && this.user.gender !== Gender.Male && this.user.details.chestCup) {
        d = d + ' ' + this.user.details.chestCup;
      }

      return d;
    } else if (key === 'weight') {
      return this.me._settings.units.weightType === 'Lbs' ? Math.round((<number>this.user.details[key].lbs)) + ' Lbs' : Math.round(this.user.details[key].kg) + ' Kg';
    } else if (['hairLength', 'hairColor', 'eyeColor'].includes(key)) {
      return this.translateService.instant(detail);
    }

    return detail;
  }

  getLanguage(key: number) {
    for (let language of this.languages) {
      if (key === language.key) {
        return this.translateService.instant(language.value);
      }
    }
  }

  async editProfile() {
    const modal = await this.modalCtrl.create({
      component: EditComponent,
      componentProps: {
        user: this.user
      },
      cssClass: 'edit-modal'
    });

    modal.present();
  }

  async showOptions() {
    const buttons = [];

    if (this.me.id === this.user.id) {
      if (!this.me.isVerified) {
        buttons.push({
          text: this.translateService.instant('VERIFYPROFILE'),
          handler: () => {
            sendEmailVerification(getAuth().currentUser, {
              url: environment.handleEmailVerification + '?userId=' + this.me.id
            }).then(async () => {
              const toast = await this.toastCtrl.create({
                message: this.translateService.instant('EMAILSENT'),
                duration: 2000
              });

              return toast.present();
            })
          }
        })
      }

      buttons.push({
        text: this.translateService.instant('EDITPROFILE'),
        handler: () => this.editProfile()
      })
    } else {
      if (this.user.membership === Membership.Standard) {
        if (this.me._privateGalleryAccessUsers?.includes(this.user.id)) {
          buttons.push({
            text: this.translateService.instant('NOTALLOWPRIVATEGALLERY'),
            handler: () => {
              this.me._privateGalleryAccessUsers = this.me._privateGalleryAccessUsers.filter(id => id !== this.user.id);
              this.userCollectionService.set(this.me.id, this.me);
            }
          })
        } else {
          buttons.push({
            text: this.translateService.instant('ALLOWPRIVATEGALLERY'),
            handler: () => {
              if (!this.me._privateGalleryAccessUsers) {
                this.me._privateGalleryAccessUsers = [];
              }

              this.me._privateGalleryAccessUsers.push(this.user.id);
              this.userCollectionService.set(this.me.id, this.me)
                .then(async () => {
                  const translations = await this.translateService.getTranslation((this.user._settings.currentLang || 'en')).toPromise();

                  return this.notificationService.sendMessage(this.user, {
                    title: translations['ITSGETTINGSEXY'],
                    body: this.me.username + translations['HASALLOWYOUPRIVATEGALLERY'],
                    badge: ProfileHelper.calculateBadge(this.user).toString()
                  }, 'privateGallery', {
                    userId: this.me.id,
                    type: 'PRIVATEGALLERY'
                  });
                })
            }
          })
        }
      }

      buttons.push({
        text: this.translateService.instant('REPORTPROFILE'),
        role: 'destructive',
        handler: () => {

        }
      });

      if (!this.me._gotBlockedFrom?.includes(this.user.id)) {
        if (!this.me._blockList?.includes(this.user.id)) {
          buttons.push({
            text: this.translateService.instant('BLOCKPROFILE'),
            role: 'destructive',
            handler: () => {
              if (!this.me._blockList) {
                this.me._blockList = [];
              }

              if (!this.user._gotBlockedFrom) {
                this.user._gotBlockedFrom = [];
              }

              this.me._blockList.push(this.user.id);
              this.user._gotBlockedFrom.push(this.me.id);

              this.userCollectionService.set(this.user.id, this.user);
              this.userCollectionService.set(this.me.id, this.me);
            }
          });
        } else {
          buttons.push({
            text: this.translateService.instant('NOTBLOCKPROFILE'),
            role: 'destructive',
            handler: () => {
              this.me._blockList = this.me._blockList .filter(id => id !== this.user.id);
              this.me._friendsList = this.me._friendsList?.filter(id => id !== this.user.id);
              this.user._gotBlockedFrom = this.user._gotBlockedFrom.filter(id => id !== this.me.id);
              this.user._friendsList = this.user._friendsList?.filter(id => id !== this.me.id);

              this.userCollectionService.set(this.user.id, this.user);
              this.userCollectionService.set(this.me.id, this.me);
            }
          });
        }
      }
    }

    const sheet = await this.actionSheetCtrl.create({
      buttons: buttons
    });

    return sheet.present();
  }

  async sendRequestForPrivateGallery() {
    const translations = await this.translateService.getTranslation((this.user._settings.currentLang || 'en')).toPromise();

    if (!this.user._privateGalleryRequests) {
      this.user._privateGalleryRequests = [];
    }
    this.user._privateGalleryRequests.push(this.me.id);

    return this.userCollectionService.set(this.user.id, this.user).then(() => {
      return this.notificationService.sendMessage(this.user, {
        //title: translations['ITSGETTINGSEXY'],
        body: this.me.username + translations['REQUESTPRIVATEGALLERY'],
        badge: ProfileHelper.calculateBadge(this.user).toString()
      }, 'privateGalleryRequest', {
        userId: this.me.id,
        type: 'PRIVATEGALLERYREQUEST',
        queryType: 'REQUESTS'
      });
    })
  }

  showGalleryRequests() {
    return this.router.navigate(['/profile/' + this.me.id + '/list'], {
      queryParams: {
        type: 'REQUESTS'
      }
    });
  }

  showReleases() {
    return this.router.navigate(['/profile/' + this.me.id + '/list'], {
      queryParams: {
        type: 'RELEASES'
      }
    });
  }

  goBack() {
    this.navCtrl.pop();
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer();
    }
  }

  showImg(isPublic, startFrom: number) {
    let imgs = [];

    if (isPublic) {
      imgs.push({
        url: this.user.profilePictures.original
      });

      if (this.user.publicAlbum?.length > 0) {
        for (let picture of this.user.publicAlbum) {
          imgs.push({
            url: picture.original
          });
        }
      }
    } else {
      for (let picture of this.user.privateAlbum) {
        imgs.push({
          url: picture.original
        });
      }
    }

    return this.cameraService.showImages(imgs, startFrom, imgs.length > 1 ? 'slider' : 'one');
  }
}
