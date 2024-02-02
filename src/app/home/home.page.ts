import {Component} from '@angular/core';
import {UserService} from "../services/user/user.service";
import {IUser} from "../interfaces/i-user";
import {LocalStorageService} from "../_shared/services/local-storage.service";
import {Router} from "@angular/router";
import {AlertController, ModalController} from "@ionic/angular";
import {FilterComponent} from "../_shared/components/filter/filter.component";
import {UserCollectionService} from "../services/user/user-collection.service";
import firebase from "firebase/compat";
import WhereFilterOp = firebase.firestore.WhereFilterOp;
import {ProfileHelper} from "../_shared/helper/Profile";
import {geohashForLocation} from "geofire-common";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Capacitor} from "@capacitor/core";
import {AppIcon} from "@capacitor-community/app-icon";
import {Membership} from "../constants/User";
import {BuyService} from "../menu/shop/services/buy.service";
import {TranslateService} from "@ngx-translate/core";
import {CollectionService} from "../services/collection.service";
import {EditComponent} from "../profile/components/edit/edit.component";


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  standardUsers: IUser[] = [];
  user: IUser;
  filter: any = {
    perimeterValue: 100,
    ageRange: {
      lower: 18,
      upper: 80
    }
  };
  queryFilter: { key: string, opr: WhereFilterOp, value: any }[] = []
  limit: number = 0;
  loading: boolean = true;
  rang: number = 1;
  snapshots: any[] = [];
  lastDoc: any;
  filteredUserIds: string[] = [];

  constructor(private userService: UserService, private localStorageService: LocalStorageService, private router: Router,
              private modalCtrl: ModalController, private localStorage: LocalStorageService, private userCollectionService: UserCollectionService,
              private httpClient: HttpClient, private buyService: BuyService, private alertCtrl: AlertController, private translateService: TranslateService) {
    this.localStorageService.getUser().then(async (user) => {
      this.user = user;

      const filter = await this.localStorage.getFilter();

      if (filter) {
        this.filter = Object.assign(this.filter, filter);
      }

      this.getUsers();
    });
  }

  async ngOnInit() {
    if (Capacitor.isNativePlatform()) {
      AppIcon.isSupported().then((value) => console.log('supported: ', value));

      await AppIcon.change({name: 'vip', suppressNotification: true}).then(() => {
        AppIcon.getName().then((name) => console.log('appName: ', name));

      }).catch((err) => console.log('nameError: ', err));
      if (this.user.membership !== Membership.Standard) {
      } else {
        //AppIcon.reset({})
      }
    }

    this.registerEvents();
  }

  async getUsers() {
    this.loading = true;
    this.standardUsers = [];
    this.queryFilter = [];

    if (this.filter.categoryFilter && this.filter.categoryFilter.length > 0) {
      this.queryFilter.push({
        key: 'categories',
        opr: 'array-contains-any',
        value: this.filter.categoryFilter
      });
    }

    this.destroyAllSnapshots();

    const userIds = [];
    const usersByDistance = await this.userCollectionService.getUsersByDistance(this.user.currentLocation,
      this.filter.perimeterValue ? this.filter.perimeterValue : 100);

    for (let user of usersByDistance) {
      let age = ProfileHelper.getAge(user.birthday);
      if (((this.filter.ageRange && !user.fakeAge
          ? this.filter.ageRange.lower <= age && this.filter.ageRange.upper >= age
          : this.filter.ageRange.lower <= user.fakeAge && this.filter.ageRange.upper >= user.fakeAge) || !this.filter.ageRange)
        && user.genderLookingFor.includes(this.user.gender) && !this.user._gotBlockedFrom?.includes(user.id) && !this.user._blockList?.includes(user.id)
        && user.id !== this.user.id && this.user.genderLookingFor.includes(user.gender)) {
        userIds.push(user.id);
      }
    }

    this.filteredUserIds = userIds;

    if (userIds.length > 0) {
      this.queryFilter.push({
        key: 'id',
        opr: 'in',
        value: userIds
      });

      this.snapshots.push(this.userService.getStandardUsers(
        10, this.queryFilter, true, (snapshot) => {
          this.standardUsers = CollectionService.getSnapshotDataFromCollection(this.standardUsers, snapshot, 'id', {
            added: (doc) => {
              this.lastDoc = doc.doc;
            }
          });
          this.loading = false;
        }))
    } else {
      this.loading = false;
    }
  }

  loadMore(event) {
    const filters = [];
    if (this.user.genderLookingFor.length < 3) {
      filters.push({
        key: 'gender',
        opr: 'in',
        value: this.user.genderLookingFor
      });
    }

    if (this.filter.categoryFilter && this.filter.categoryFilter.length > 0) {
      filters.push({
        key: 'categories',
        opr: 'array-contains-any',
        value: this.filter.categoryFilter
      });
    }

    filters.push({
      key: 'id',
      opr: 'in',
      value: this.filteredUserIds
    });

    this.snapshots.push(this.userCollectionService.getAll(20, this.lastDoc, filters, [
      {key: 'membership', descending: 'desc'},
      {key: 'lastBoostAt', descending: 'desc'}
    ], null, true, (snapshot) => {
      this.standardUsers = CollectionService.getSnapshotDataFromCollection(this.standardUsers, snapshot, 'id', {
        added: (doc) => {
          this.lastDoc = doc.doc;
        }
      });
      this.loading = false;

      setTimeout(() => {
        event.target.complete();
      }, 1000);
    }));
  }

  showProfile(user: IUser) {
    this.router.navigate(['/profile/' + user.id]);
  }

  registerEvents() {
    document.addEventListener('user', (e: any) => {
      this.user = e.detail.user;
    })
  }

  async showFilter() {
    if (!this.filter.location || this.filter.location.type === 'currentLocation') {
      this.filter.location = {
        type: 'currentLocation',
        currentLocation: this.user.currentLocation
      };
    }

    const modal = await this.modalCtrl.create({
      component: FilterComponent,
      cssClass: 'filter-modal',
      componentProps: {
        me: this.user,
        location: this.filter.location,
        perimeterMax: 100,
        perimeterValue: this.filter.perimeterValue,
        ageRange: this.filter.ageRange,
        type: 'world',
        categoryFilter: this.filter.categoryFilter
      }
    });

    modal.present();

    modal.onDidDismiss().then((result) => {
      if (result.data) {
        this.filter = Object.assign(this.filter, result.data);

        if (this.filter.location?.type) {
          this.user.currentLocation.hash = geohashForLocation([
            this.filter.location.currentLocation.lat,
            this.filter.location.currentLocation.lng]);
          this.user.currentLocation.lat = this.filter.location.currentLocation.lat;
          this.user.currentLocation.lng = this.filter.location.currentLocation.lng;
        }

        this.localStorage.setFilter(this.filter).then(() => {
          document.dispatchEvent(new CustomEvent('update-rang'));
          this.userCollectionService.set(this.user.id, this.user);
        });

        this.getUsers();
      }
    })
  }

  handleRefresh(ev) {
    this.loading = true;
    this.standardUsers = [];

    this.getUsers().then(() => {
      ev.target.complete();
    });
  }

  showNotifications() {
    return this.router.navigate(['/notifications']);
  }

  private destroyAllSnapshots() {
    for (let snapshot of this.snapshots) {
      snapshot();
    }

    this.snapshots = [];
  }

  getPercentOfUserDetails() {
    if (this.user) {
      return ProfileHelper.getPercentOfUserDetails(this.user);
    }

    return 0;
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

  ngOnDestroy() {
    this.destroyAllSnapshots();
  }
}
