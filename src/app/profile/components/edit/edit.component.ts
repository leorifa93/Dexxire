import {ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {IUser} from "../../../interfaces/i-user";
import {ActionSheetController, ModalController, PickerController} from "@ionic/angular";
import {TranslateService} from "@ngx-translate/core";
import {UploadService} from "../../../_shared/services/upload.service";
import {CameraService} from "../../../_shared/services/camera.service";
import {UserCollectionService} from "../../../services/user/user-collection.service";
import {AbstractModalController} from "../../../_shared/controller/ModalController";
import {Ethnicity, Gender, Languages} from "../../../constants/User";
import {CountriesService} from "../../../_shared/services/countries.service";
import {CSS_COLOR_NAMES} from "../../../constants/Colors";
import {LocalStorageService} from "../../../_shared/services/local-storage.service";
import {Subscription} from "rxjs";
import countryPhoneCodes from "../../../_shared/classes/defaults/countryPhoneCodes";

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
})
export class EditComponent extends AbstractModalController implements OnInit {
  @ViewChild('editSlides') swiperRef: ElementRef;
  @Input() user: IUser;

  maxSlides: number = 4;
  categories: any[] = [];
  genders: { key: Gender, value: string }[] = [
    {key: Gender.Male, value: 'MALE'},
    {key: Gender.Female, value: 'FEMALE'},
    {key: Gender.Transsexual, value: 'TRANSSEXUAL'}
  ]
  ethnicities: { key: Ethnicity, value: string }[] = [
    {key: Ethnicity.Asian, value: this.translateService.instant('ASIAN')},
    {key: Ethnicity.Exotic, value: this.translateService.instant('EXOTIC')},
    {key: Ethnicity.Ebony, value: this.translateService.instant('EBONY')},
    {key: Ethnicity.Caucasian, value: this.translateService.instant('CAUCASIAN')},
    {key: Ethnicity.MiddleEast, value: this.translateService.instant('MIDDLEEAST')},
    {key: Ethnicity.NativeAmerican, value: this.translateService.instant('NATIVEAMERICAN')},
    {key: Ethnicity.Latin, value: this.translateService.instant('LATIN')},
    {key: Ethnicity.Eastindian, value: this.translateService.instant('EASTINDIAN')},
  ]
  languages: { key: Languages, value: string }[] = [
    {key: Languages.Arabic, value: this.translateService.instant('ARABIC')},
    {key: Languages.Chinese, value: this.translateService.instant('CHINESE')},
    {key: Languages.English, value: this.translateService.instant('ENGLISH')},
    {key: Languages.French, value: this.translateService.instant('FRENCH')},
    {key: Languages.Hindi, value: this.translateService.instant('HINDI')},
    {key: Languages.German, value: this.translateService.instant('GERMAN')},
    {key: Languages.Japanese, value: this.translateService.instant('JAPANESE')},
    {key: Languages.Portuguese, value: this.translateService.instant('PORTUGUESE')},
    {key: Languages.Russian, value: this.translateService.instant('RUSSIAN')},
    {key: Languages.Spanish, value: this.translateService.instant('SPANISH')},
    {key: Languages.Italy, value: this.translateService.instant('ITALY')}
  ];
  eyeColors: string[] = ['BROWN', 'BLUE', 'HAZEL', 'GREEN', 'GRAY'];
  hairColors: string[] = ['BLONDE', 'BRUNETTE', 'BLACK', 'PLATINUM', 'RED'];
  chestCups: string[] = ['AA', 'A', 'B', 'C', 'D', 'DD', 'DDD', 'DDDD', 'E', 'F', 'G', 'H'];
  hairLength: string[] = ['NOHAIR', 'SHORT', 'SHOULDERLONG', 'LONG', 'VERYLONG'];
  countries: { country: string, key: string, region: string, flag: string }[] = [];
  colors: any = [];
  colorhashes: any = CSS_COLOR_NAMES;
  settings: any = {};
  maxPictures: number = 7;
  imageSubscriber: Subscription;
  countryPhoneCodes: any[] = [];
  currentStep: number = 0;

  constructor(private actionSheetCtrl: ActionSheetController, private translateService: TranslateService,
              private uploadService: UploadService, private cameraService: CameraService,
              private userService: UserCollectionService, protected modalCtrl: ModalController,
              private countriesService: CountriesService, private localStorage: LocalStorageService, private changeDetector: ChangeDetectorRef,
              private pickerCtrl: PickerController) {
    super(modalCtrl)
    this.countryPhoneCodes = countryPhoneCodes;
    this.languages = this.languages.sort((a, b) => {
      return a.value > b.value ? 1 : -1;
    });
    this.eyeColors = this.eyeColors.sort((a, b) => {
      return a > b ? 1 : -1;
    });
    this.hairColors = this.hairColors.sort((a, b) => {
      return a > b ? 1 : -1;
    });
  }

  ngOnInit() {
    console.log(Intl.DateTimeFormat().resolvedOptions().timeZone);
    this.localStorage.getSettings().then(settings => this.settings = settings);

    this.colors = Object.keys(CSS_COLOR_NAMES);

    if (!this.user.details) {
      this.user.details = {};
    }

    if (!this.user.contacts) {
      this.user.contacts = {};
      this.user.contacts.whatsApp = {};
      this.user.contacts.phoneNumber = {};
    }

    if (!this.user.socialMedia) {
      this.user.socialMedia = {};
    }

    this.userService.getAll(20, null, [{
      key: "genders",
      opr: 'array-contains',
      value: this.user.gender
    }], undefined, 'UserCategories').then((result) => {
      this.categories = result;
      this.categories = this.categories.map((category) => {
        category.value = this.translateService.instant(category.value);
        return category;
      });
      this.categories = this.categories.sort((a, b) => {
        return a.value > b.value ? 1 : -1;
      });
    });

    this.countriesService.getAll().then(countries => this.countries = countries);
  }

  ngAfterViewInit() {
    this.swiperRef.nativeElement.swiper.allowTouchMove = false;
  }

  setStep(step: number) {
    this.currentStep = step;
    this.swiperRef.nativeElement.swiper.slideTo(step);
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

  async openPicker(type: string, unitType?: string, min?: number, max?: number, defaultValue?: any) {
    let columns = [];
    let index = 0;
    let selectedIndex = 0;

    if (unitType && min && max) {
      for (let i = min; i <= max; i++) {
        columns.push({
          text: i + ' ' + unitType,
          value: i
        });

        if (this.user.details[type] && this.user.details[type][unitType] === i) {
          selectedIndex = index;
        } else if (defaultValue && i === defaultValue) {
          selectedIndex = index;
        }

        index++;
      }
    }

    if (type === 'chestCup') {
      for (let value of this.chestCups) {
        columns.push({
          text: this.translateService.instant(value),
          value: value
        });

        if (this.user.details[type] && this.user.details[type] === value) {
          selectedIndex = index;
        } else if (defaultValue && value === defaultValue) {
          selectedIndex = index;
        }

        index++;
      }
    } else if (type === 'eyeColor') {
      for (let value of this.eyeColors) {
        columns.push({
          text: this.translateService.instant(value),
          value: value
        });

        if (this.user.details[type] && this.user.details[type] === value) {
          selectedIndex = index;
        } else if (defaultValue && value === defaultValue) {
          selectedIndex = index;
        }

        index++;
      }
    } else if (type === 'hairColor') {
      for (let value of this.hairColors) {
        columns.push({
          text: this.translateService.instant(value),
          value: value
        });

        if (this.user.details[type] && this.user.details[type] === value) {
          selectedIndex = index;
        } else if (defaultValue && value === defaultValue) {
          selectedIndex = index;
        }

        index++;
      }
    } else if (type === 'hairLength') {
      for (let value of this.hairLength) {
        columns.push({
          text: this.translateService.instant(value),
          value: value
        });

        if (this.user.details[type] && this.user.details[type] === value) {
          selectedIndex = index;
        } else if (defaultValue && value === defaultValue) {
          selectedIndex = index;
        }

        index++;
      }
    } else if (['phoneNumber', 'whatsApp'].includes(type)) {
      for (let codes of this.countryPhoneCodes) {
        columns.push({
          text: '+' + codes.code + ` (${codes.country})`,
          value: codes.code
        });
      }
    }

    if (['eyeColor', 'hairColor'].includes(type)) {
      columns = columns.sort((a, b) => {
        return a.text > b.text ? 1 : -1;
      });
    }

    const picker = await this.pickerCtrl.create({
      columns: [
        {
          name: this.translateService.instant(type),
          selectedIndex: selectedIndex,
          options: columns
        }
      ],
      buttons: [
        {
          text: this.translateService.instant('CANCEL'),
          role: 'cancel',
        },
        {
          text: this.translateService.instant('APPLY'),
          handler: (value) => {
            if (['chest', 'height', 'waist', 'hips'].includes(type)) {
              this.setCmAndInch(value[this.translateService.instant(type)].value, type);
            } else if (['weight'].includes(type)) {
              this.setKgAndLbs(value[this.translateService.instant(type)].value, type)
            } else if (['chestCup', 'hairColor', 'eyeColor', 'hairLength'].includes(type)) {
              this.user.details[type] = value[this.translateService.instant(type)].value;
            } else if (['phoneNumber', 'whatsApp'].includes(type)) {
              if (!this.user.contacts[type]) {
                this.user.contacts[type] = {};
              }

              this.user.contacts[type].countryCode = value[this.translateService.instant(type)].value;
            }
          },
        },
      ]
    });

    return picker.present();
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

    if (!isProfileImage) {
      if (isPublic) {
        buttons.push({
          text: this.translateService.instant('MAKETOPROFILEIMG'),
          handler: () => {
            const temp = this.user.profilePictures;
            this.user.profilePictures = this.user.publicAlbum[index];
            this.user.publicAlbum[index] = temp;

            this.userService.set(this.user.id, this.user);
          }
        });
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
    let limit;
    let directoryIndex;

    if (isPublic) {
      limit = this.user.publicAlbum?.length > 0 ? this.maxPictures - this.user.publicAlbum.length : this.maxPictures;
      directoryIndex = this.user.publicAlbum?.length > 0 ? this.user.publicAlbum.length : 0;
    } else {
      limit = this.user.privateAlbum?.length > 0 ? this.maxPictures - this.user.privateAlbum.length : this.maxPictures;
      directoryIndex = this.user.privateAlbum?.length > 0 ? this.user.privateAlbum.length : 0;
    }

    if (isNaN(index)) {
      this.imageSubscriber = this.cameraService.getPictures(limit).subscribe((base64) => {
        if (base64) {
          directoryIndex++;

          if (directoryIndex > this.maxPictures) {
            return;
          }

          this.setImageToUploader(isPublic, isPrimary, directoryIndex, base64);
        }
      })
    } else {
      this.cameraService.getPicture().then((result) => {
        this.setImageToUploader(isPublic, isPrimary, index, result, true);
      })
    }
  }

  private setImageToUploader(isPublic: boolean, isPrimary: boolean, directoryIndex, base64: string, isIndexSet: boolean = false) {
    let path;

    if (isPrimary) {
      path = `${this.user.id}/Public/0/image`;
    } else {
      path = isPublic
        ? `${this.user.id}/Public/${directoryIndex}/image`
        : `${this.user.id}/Private/${directoryIndex}/image`;
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

          if (!isIndexSet) {
            this.user.publicAlbum.push(pictures);
          } else {
            this.user.publicAlbum[directoryIndex] = pictures;
          }
        } else {
          if (!this.user.privateAlbum) {
            this.user.privateAlbum = [];
          }

          if (!isIndexSet) {
            this.user.privateAlbum.push(pictures);
          } else {
            this.user.privateAlbum[directoryIndex] = pictures;
          }
        }
      }

      return this.userService.set(this.user.id, this.user);
    })
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

  setCmAndInch(value, property: string) {
    const length = value;

    if (!this.user.details[property]) {
      this.user.details[property] = {}
    }

    if (this.user._settings.units.lengthType === 'Inch') {
      this.user.details[property].inch = (<Number>length);
      this.user.details[property].cm = length * 2.54;
    } else {
      this.user.details[property].cm = (<Number>length);
      this.user.details[property].inch = length / 2.54;
    }
    this.user.details[property].cm = Math.round(this.user.details[property].cm);
    this.user.details[property].inch = Math.round(this.user.details[property].inch);
  }

  getLbsFromKg(kg: number) {
    return Math.round(kg * 2.2046);
  }

  getInchFromCm(cm: number) {
    return Math.round(cm / 2.54);
  }

  setKgAndLbs(value, property: string) {
    const weight = value;

    this.user.details[property] = {};

    if (this.user._settings.units.weightType === 'Lbs') {
      this.user.details[property].lbs = (<Number>weight);
      this.user.details[property].kg = weight / 2.20462;
    } else {
      this.user.details[property].kg = (<Number>weight);
      this.user.details[property].lbs = weight * 2.2046;
    }

    this.user.details[property].kg = Math.round(this.user.details[property].kg);
    this.user.details[property].lbs = Math.round(this.user.details[property].lbs);
  }

  ngOnDestroy() {
    if (this.imageSubscriber) {
      this.imageSubscriber.unsubscribe();
    }
  }
}
