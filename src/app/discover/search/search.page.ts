import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {ModalController, NavController} from "@ionic/angular";
import {AbstractBase} from "../../_shared/classes/AbstractBase";
import {LocalStorageService} from "../../_shared/services/local-storage.service";
import {ActivatedRoute} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";
import {UserCollectionService} from "../../services/user/user-collection.service";
import firebase from "firebase/compat";
import WhereFilterOp = firebase.firestore.WhereFilterOp;
import {IUser} from "../../interfaces/i-user";
import {UserService} from "../../services/user/user.service";
import {LocationService} from "../../_shared/services/location.service";
import {LocationPage} from "../../_shared/pages/location/location.page";
import {geohashForLocation} from "geofire-common";
import algoliasearch, {SearchClient, SearchIndex} from 'algoliasearch';
import {environment} from "../../../environments/environment";


@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage extends AbstractBase implements OnInit {

  @Input() type: string = 'page';
  queryFilter: { key: string, opr: WhereFilterOp, value: any }[] = []
  user: IUser;
  users: IUser[] = [];
  country: string;
  city: string;
  federaleState: string;
  category: string;
  loading: boolean = false;
  cityTitle: string;
  client: SearchClient;
  index: SearchIndex;
  searchString: string;
  searchedFriends: IUser[] = [];
  maxPages: number = 0;
  currentPage: number = 0;
  state: 'location' | 'search' = 'location';
  showCategories: boolean = true;
  categories: any[] = [];
  filter: any = {
    categoryFilter: []
  };
  lang: string;

  constructor(protected localStorage: LocalStorageService, protected navCtrl: NavController,
              private route: ActivatedRoute, private translateService: TranslateService,
              private modalCtrl: ModalController, private userCollectionService: UserCollectionService,
              private userService: UserService, private locationService: LocationService,
              protected changeDetector: ChangeDetectorRef) {
    super(localStorage, navCtrl, changeDetector);
  }

  ngOnInit() {
    this.lang = this.route.snapshot.paramMap.get('lang');
    this.country = this.route.snapshot.paramMap.get('country');
    this.city = this.route.snapshot.paramMap.get('city');
    this.category = this.route.snapshot.paramMap.get('category');
    this.federaleState = this.route.snapshot.paramMap.get('federaleState');

    this.localStorage.getUser().then(async (user) => {
      this.user = user;
      this.client = algoliasearch(environment.algolia.appId, environment.algolia.apiKey);
      this.index = this.client.initIndex('dexxire');
      const searchableAttributes = [
        'username',
        'location.location',
      ];

      this.index.setSettings({
        customRanking: ['asc(username)'],
        searchableAttributes: searchableAttributes
      });
      this.categories = await this.userCollectionService.getAll(10, null, [{
        key: "genders",
        opr: 'array-contains-any',
        value: this.user.genderLookingFor
      }], undefined, 'UserCategories');

      if (this.category) {
        let categories = this.category.split(',');
        categories = categories.map((category) => category.toUpperCase());

        for (let category of this.categories) {
          if (categories.includes(category.value)) {
            this.filter.categoryFilter.push(category.key);
          }
        }
      }

      if (this.state === 'location') {
        this.getUsers();
      }
    })
  }

  ngAfterViewInit() {
    setTimeout(() => {
      if (this.lang) {
        this.translateService.use(this.lang);
      }
    }, 1000);
  }
  private search(page: number) {
    this.index.search(this.searchString, {
      page: page
    }).then((data: any) => {
      var resultUsers = [];

      for (let user of data.hits) {
        if (this.user.genderLookingFor.includes(user.gender) && user.genderLookingFor.includes(this.user.gender)) {
          resultUsers.push(user);
        }
      }

      this.searchedFriends = this.searchedFriends.concat(resultUsers);
      this.maxPages = data.nBPages;
      this.currentPage = data.page;
    });

    //this.keyBoardService.closeKeyBoard();
  }

  getNextPage(event) {
    if (this.currentPage !== this.maxPages) {
      this.search(this.currentPage + 1);
    }

    event.target.complete();
  }

  override goBack() {
    if (this.type === 'page') {
      this.navCtrl.pop();
    } else {
      this.modalCtrl.dismiss();
    }
  }

  getUsers() {
    this.searchString = '';
    this.state = 'location';
    this.loading = true;
    this.queryFilter = [];
    this.queryFilter.push({
      key: 'gender',
      opr: 'in',
      value: this.user.genderLookingFor
    });

    if (this.filter.categoryFilter && this.filter.categoryFilter.length > 0) {
      this.queryFilter.push({
        key: 'categories',
        opr: 'array-contains-any',
        value: this.filter.categoryFilter
      });
    }

    if (this.country && this.federaleState && this.city) {
      this.userService.getUserByQueryParams(null, this.city, this.country, this.federaleState, this.queryFilter).then((users:IUser[]) => {
        this.users = users;
        this.users = this.users.filter((user) => user.id !== this.user.id);
        this.loading = false;
      });

      this.locationService.getDataFromAddress(this.federaleState + ' ' + this.city).then((data) => {
        this.cityTitle = data.address;
      })
    } else {
      this.loading = false;
    }
  }

  showProfile(user: IUser) {
    this.userService.showProfile(user, this.user);
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

        this.locationService.getCityFromLatLng(result.data.lat, result.data.lng).then((data: any) => {
          data = data[0];

          if (data) {
            this.city = data.locality;
            this.federaleState = data.state;
            this.country = data.country;

            return this.getUsers();
          }
        })
      }
    })

    return modal.present();
  }

  onSearch() {
    this.state = 'search';
    this.searchedFriends = [];

    this.search(0);
  }

  toggleCategories() {
    this.showCategories = !this.showCategories;
  }

  toggleCategory(category: string) {
    if (!this.filter.categoryFilter) {
      this.filter.categoryFilter = [];
    }

    if (this.filter.categoryFilter.includes(category)) {
      this.filter.categoryFilter = this.filter.categoryFilter.filter(c => {
        return c !== category;
      });
    } else {
      this.filter.categoryFilter.push(category);
    }

    this.getUsers();
  }
}
