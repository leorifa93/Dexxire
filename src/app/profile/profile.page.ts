import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {IUser} from "../interfaces/i-user";
import {ActivatedRoute} from "@angular/router";
import {LocationService} from "../_shared/services/location.service";
import {DistanceHelper} from "../_shared/helper/Distance";
import {Ethnicity, Gender, Languages} from "../constants/User";
import {ModalController} from "@ionic/angular";
import {EditComponent} from "./components/edit/edit.component";
import {TranslateService} from "@ngx-translate/core";
import {CountriesService} from "../_shared/services/countries.service";

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
  contentState: string = 'ABOUTME';
  profileDetails = ['ethnicity', 'nationality', 'height', 'weight', 'height', 'chest', 'waist', 'hips', 'eyeColor', 'hairColor', 'hairLength'];

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


  constructor(private router: ActivatedRoute, private locationService: LocationService, private modalCtrl: ModalController,
              private translateService: TranslateService, private countriesService: CountriesService) {
    this.user = JSON.parse(this.router.snapshot.queryParamMap.get('user'));
    this.me = JSON.parse(this.router.snapshot.queryParamMap.get('me'));

    if (this.user.gender === Gender.Female) {
      this.profileDetails = this.profileDetails.map(detail => {
        if (detail === 'chest') {
          detail =  'chestCup'
        }

        return detail;
      })
    }
  }

  ngOnInit() {
    const distance = (<any>DistanceHelper.calcDistance(
      this.me.currentLocation.lat,
      this.me.currentLocation.lng,
      this.user.currentLocation.lat,
      this.user.currentLocation.lng,
      0
    ));

    this.distance = DistanceHelper.kmToMiles(distance) > 99 ? '>99Mi' : DistanceHelper.kmToMiles(distance) + 'Mi';

    this.locationService.getCityFromLatLng(
      this.user.currentLocation.lat,
      this.user.currentLocation.lng
    ).then((formatAddress: any) => {
      this.currentCity = formatAddress[0].locality + ', ' + formatAddress[0].state;
    });

    this.countriesService.getAll().then(countries => this.countries = countries);
  }

  ngAfterViewInit() {
    if (this.user.publicAlbum.length >= 3) {

      setTimeout(() => {
        this.swiperRef.nativeElement.swiper.slideNext(0);
      })
    }
  }

  changeContentState(state: string) {
    this.contentState = state;
  }

  detailExists(key: string) {
    if (this.user.details && this.user.details[key]) {
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
      }
    });

    modal.present();
  }
}
