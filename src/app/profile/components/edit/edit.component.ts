import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {IUser} from "../../../interfaces/i-user";
import {ActionSheetController, ModalController} from "@ionic/angular";
import {TranslateService} from "@ngx-translate/core";
import {UploadService} from "../../../_shared/services/upload.service";
import {CameraService} from "../../../_shared/services/camera.service";
import {UserCollectionService} from "../../../services/user/user-collection.service";
import {AbstractModalController} from "../../../_shared/controller/ModalController";
import {Ethnicity, Gender, Languages} from "../../../constants/User";
import {CountriesService} from "../../../_shared/services/countries.service";

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
})
export class EditComponent extends AbstractModalController implements OnInit {
  @ViewChild('editSlides') swiperRef: ElementRef;
  @Input() user: IUser;
  details: any = [
    {
      property: 'ethnicity',
      type: 'select',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">\n' +
        '  <path d="M19.5002 10.509C19.5002 11.774 18.7712 12.5 17.4992 12.5H13.5011C12.2301 12.5 11.5002 11.774 11.5002 10.509C11.5002 9.12103 12.2862 7.5 14.5002 7.5H16.5002C18.7142 7.5 19.5002 9.12103 19.5002 10.509ZM15.5052 6C16.7452 6 17.7552 4.991 17.7552 3.75C17.7552 2.509 16.7452 1.5 15.5052 1.5C14.2652 1.5 13.2552 2.509 13.2552 3.75C13.2552 4.991 14.2652 6 15.5052 6ZM11.5002 20.509C11.5002 21.774 10.7712 22.5 9.49919 22.5H5.50115C4.23015 22.5 3.50017 21.774 3.50017 20.509C3.50017 19.121 4.28617 17.5 6.50017 17.5H8.50017C10.7142 17.5 11.5002 19.121 11.5002 20.509ZM7.50517 16C8.74517 16 9.75517 14.991 9.75517 13.75C9.75517 12.509 8.74517 11.5 7.50517 11.5C6.26517 11.5 5.25517 12.509 5.25517 13.75C5.25517 14.991 6.26517 16 7.50517 16ZM3.74516 11.187C4.00616 8.80401 5.26611 6.70301 7.19011 5.36401V7.10498C7.19011 7.51898 7.52611 7.85498 7.94011 7.85498C8.35411 7.85498 8.69011 7.51898 8.69011 7.10498V4.05505C8.69011 3.79605 8.55623 3.55497 8.33623 3.41797C8.11623 3.28097 7.84318 3.26698 7.60918 3.38098C4.61818 4.84798 2.6162 7.70495 2.2542 11.0229C2.2082 11.4349 2.50614 11.805 2.91814 11.85C2.94514 11.853 2.97317 11.854 3.00017 11.854C3.37917 11.855 3.70316 11.571 3.74516 11.187ZM16.3902 20.729C19.3812 19.261 21.3832 16.404 21.7452 13.087C21.7912 12.675 21.4932 12.305 21.0812 12.26C20.6682 12.218 20.3002 12.512 20.2552 12.924C19.9942 15.3069 18.7342 17.4079 16.8102 18.7469V17.006C16.8102 16.592 16.4742 16.256 16.0602 16.256C15.6462 16.256 15.3102 16.592 15.3102 17.006V20.056C15.3102 20.315 15.4441 20.556 15.6641 20.693C15.7851 20.768 15.9232 20.806 16.0602 20.806C16.1732 20.806 16.2852 20.78 16.3902 20.729Z" fill="url(#paint0_linear_100_2632)"/>\n' +
        '  <defs>\n' +
        '    <linearGradient id="paint0_linear_100_2632" x1="11.9997" y1="1.5" x2="11.9997" y2="22.5" gradientUnits="userSpaceOnUse">\n' +
        '      <stop stop-color="#E0030C"/>\n' +
        '      <stop offset="1" stop-color="#9B0207"/>\n' +
        '    </linearGradient>\n' +
        '  </defs>\n' +
        '</svg>'
    }
  ]

  maxSlides: number = 4;
  categories: any[] = [];
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

  constructor(private actionSheetCtrl: ActionSheetController, private translateService: TranslateService,
              private uploadService: UploadService, private cameraService: CameraService,
              private userService: UserCollectionService, protected modalCtrl: ModalController,
              private countriesService: CountriesService) {
    super(modalCtrl)
  }

  ngOnInit() {
    if (!this.user.details) {
      this.user.details = {};
    }

    this.userService.getAll(10, null, [{
      key: "genders",
      opr: 'array-contains',
      value: this.user.gender
    }], undefined, 'UserCategories').then((result) => {
      this.categories = result;
    });

    this.countriesService.getAll().then(countries => this.countries = countries);
  }

  ngAfterViewInit() {
    this.swiperRef.nativeElement.swiper.allowTouchMove = false;
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

  save() {
    this.userService.set(this.user.id, this.user).then(() => {
      this.closeModal();
    });
  }

  async showOptions(isProfileImage?: boolean, index?: number, isPublic?: boolean) {
    const buttons: any = [
      {
        text: this.translateService.instant('REPLACE'),
        handler: () => {
          this.chooseImage(isPublic, isProfileImage, index);
        }
      }
    ];

    if (!isProfileImage && isPublic) {
      buttons.push({
        text: this.translateService.instant('MAKETOPROFILEIMG'),
        handler: () => {
          const temp = this.user.profilePictures;
          this.user.profilePictures = this.user.publicAlbum[index];
          this.user.publicAlbum[index] = temp;

          this.userService.set(this.user.id, this.user);
        }
      }

      buttons.push({
        text: this.translateService.instant('DELETE'),
        role: 'destructive',
        handler: () => {
          if (isPublic) {
            this.user.publicAlbum.splice(index, 1)
          } else {
            this.user.privateAlbum.splice(index, 1)
          }

          this.userService.set(this.user.id, this.user);
        }
      });
    }

    const actionSheet = await this.actionSheetCtrl.create({
      buttons: buttons
    });

    return actionSheet.present();
  }

  chooseImage(isPublic?: boolean, isPrimary?: boolean, index?: number) {
    this.cameraService.getPicture().then((base64: string) => {
      let path;

      if (isPrimary) {
        path = `${this.user.id}/Public/0/image`;
      } else {
        if (isNaN(index)) {
          path = isPublic
            ? `${this.user.id}/Public/${(this.user.publicAlbum?.length || 0) + 1}/image`
            : `${this.user.id}/Private/${(this.user.privateAlbum?.length || 0) + 1}/image`;
        } else {
          path = isPublic
            ? `${this.user.id}/Public/${index + 1}/image`
            : `${this.user.id}/Private/${index + 1}/image`;
        }
      }

      this.uploadImage(base64, path).then((pictures: any) => {
        if (isPrimary) {
          this.user.profilePictures = pictures;
          this.user.profilePictures.uploadAt = Date.now();
        } else {
          if (isPublic) {
            if (!this.user.publicAlbum) {
              this.user.publicAlbum = [];
            }

            if (isNaN(index)) {
              this.user.publicAlbum.push(pictures);
            } else {
              this.user.publicAlbum[index] = pictures;
            }
          } else {
            if (!this.user.privateAlbum) {
              this.user.privateAlbum = [];
            }

            if (!index) {
              this.user.privateAlbum.push(pictures);
            } else {
              this.user.privateAlbum[index] = pictures;
            }
          }
        }

        return this.userService.set(this.user.id, this.user);
      })
    });
  }

  uploadImage(base64, path: string) {
    return this.uploadService.uploadFile(base64, path);
  }

  slideNext() {
    this.swiperRef.nativeElement.swiper.slideNext(500);
  }

  slidePrev() {
    this.swiperRef.nativeElement.swiper.slidePrev(500);
  }

  calculateProgress() {
    if (this.swiperRef) {
      return ((100 / this.maxSlides) * (this.swiperRef.nativeElement.swiper.activeIndex + 1)) / 100;
    } else {
      return 0.2;
    }
  }

  onSelectCountry(event: any) {
    for (let country of this.countries) {
      if (event.detail.value === country.key) {
        this.user.details.nationality = {
          code: country.key,
          country: country.country
        }
      }
    }
  }
}
