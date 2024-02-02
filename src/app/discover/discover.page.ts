import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {UserService} from "../services/user/user.service";
import {IUser} from "../interfaces/i-user";
import {LocalStorageService} from "../_shared/services/local-storage.service";
import {UserCollectionService} from "../services/user/user-collection.service";
import {TranslateService} from "@ngx-translate/core";
import firebase from "firebase/compat";
import WhereFilterOp = firebase.firestore.WhereFilterOp;
import {FilterComponent} from "../_shared/components/filter/filter.component";
import {ModalController} from "@ionic/angular";
import {geohashForLocation} from "geofire-common";
import {ProfileHelper} from "../_shared/helper/Profile";
import {Router} from "@angular/router";
import {BuyService} from "../menu/shop/services/buy.service";
import {DistanceHelper} from "../_shared/helper/Distance";

declare var google: any;

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit {

  @ViewChild('mapElement') mapNativeElement: ElementRef;
  discoverUsers: IUser[] = [];
  usersByDistance: IUser[] = [];
  me: IUser;
  categories: any[] = [];
  filter: any = {
    perimeterValue: 100,
    ageRange: {
      lower: 18,
      upper: 80
    }
  };
  queryFilter: { key: string, opr: WhereFilterOp, value: any }[] = [];
  loading: boolean = true;
  showCategories: boolean = true;
  map: any;

  constructor(private userService: UserService, private localStorage: LocalStorageService,
              private userCollectionService: UserCollectionService, private translateService: TranslateService,
              private modalCtrl: ModalController, private router: Router, private buyService: BuyService) {
    this.localStorage.getUser().then(async (user) => {
      this.me = user;
      const filter = await this.localStorage.getFilter();

      if (filter) {
        this.filter = Object.assign(this.filter, filter);
      }
      this.loadUsers();
    });
  }

  ngOnInit() {
  }

  loadUsers() {
    this.loading = true;
    this.queryFilter = [];

    if (this.me.genderLookingFor.length < 3) {
      this.queryFilter.push({
        key: 'gender',
        opr: 'in',
        value: this.me.genderLookingFor
      });
    }

    if (this.filter.categoryFilter && this.filter.categoryFilter.length > 0) {
      this.queryFilter.push({
        key: 'categories',
        opr: 'array-contains-any',
        value: this.filter.categoryFilter
      });
    }

    this.userCollectionService.getUsersByDistance({
      lat: this.me.currentLocation.lat,
      lng: this.me.currentLocation.lng,
    }, this.filter.perimeterDiscoverValue ? this.filter.perimeterDiscoverValue : 10, this.queryFilter).then((users: IUser[]) => {
      users = users.filter((user) => {
        let age = ProfileHelper.getAge(user.birthday);
        return user.genderLookingFor.includes(this.me.gender) && user.id !== this.me.id && ((this.filter.ageRange && !user.fakeAge
          ? this.filter.ageRange.lower <= age && this.filter.ageRange.upper >= age
          : this.filter.ageRange.lower <= user.fakeAge && this.filter.ageRange.upper >= user.fakeAge) || !this.filter.ageRange);
      });

      this.usersByDistance = users;
      this.usersByDistance = users.sort((a,b) => {
        const aDistance = parseFloat(DistanceHelper.calcDistance(
          this.me.currentLocation.lat,
          this.me.currentLocation.lng,
          a.currentLocation.lat,
          a.currentLocation.lng,
          5
        ));
        const bDistance = parseFloat(DistanceHelper.calcDistance(
          this.me.currentLocation.lat,
          this.me.currentLocation.lng,
          b.currentLocation.lat,
          b.currentLocation.lng,
          5
        ));

        return aDistance > bDistance ? 1 : -1;
      })
      this.renderUserMap();

      this.loading = false;
    });
  }

  showProfile(user: IUser) {
    this.userService.showProfile(user, this.me);
  }

  renderUserMap(): void {
    this.map = new google.maps.Map(this.mapNativeElement.nativeElement, {
      fullscreenControl: false,
      streetViewControl: false,
      disableDefaultUI: true,
      center: {lat: this.me.currentLocation.lat, lng: this.me.currentLocation.lng},
      zoom: 12,
      styles: [
        {
          featureType: "poi.business",
          stylers: [{visibility: "off"}],
        },
        {
          featureType: "transit",
          elementType: "labels.icon",
          stylers: [{visibility: "off"}],
        },
      ],
    });


    const pos = {
      lat: this.me.currentLocation.lat,
      lng: this.me.currentLocation.lng
    };
    this.map.setCenter(pos);

    for (let user of this.usersByDistance) {
      if (this.me.id !== user.id) {
        let marker = new google.maps.Marker({
          position: {
            lat: user.currentLocation.lat,
            lng: user.currentLocation.lng
          },
          map: this.map,
          icon: {
            url: (user.profilePictures.thumbnails?.small || user.profilePictures.original),
            scaledSize: new google.maps.Size(60, 60),
          }
        });

        const connectWithLabel = this.translateService.translations[this.translateService.currentLang]['CONNECTWITH'] + ' <strong>' + user.username + ' 👋</strong>';
        const contentString = '<div id="content">' +
          '<div class="connect-notice" id="' + user.id + '"><p> ' +
          connectWithLabel +
          '</p></div>' +
          '</div>';
        const infowindow = new google.maps.InfoWindow({
          content: contentString,
          maxWidth: 400,
          disableAutoPan: true
        });

        marker.addListener('click', () => {
          this.map.setZoom(18);
          this.map.setCenter(marker.getPosition());
          infowindow.open(this.map, marker);

          setTimeout(() => {
            document.querySelector('.connect-notice').addEventListener('click', async (e: any) => {
              const user = await this.userCollectionService.get(e.currentTarget.id);
              this.userService.showProfile(user, this.me);
            });
          }, 100)
        });


        const myoverlay = new google.maps.OverlayView();
        myoverlay.draw = function () {
          this.getPanes().markerLayer.className = 'userMarker';
        };
        myoverlay.setMap(this.map);
      }
    }

    new google.maps.Marker({
      position: {
        lat: this.me.currentLocation.lat,
        lng: this.me.currentLocation.lng
      },
      map: this.map
    });
  }

  zoomIn() {
    this.map.setZoom(this.map.getZoom() + 1);
  }

  zoomOut() {
    this.map.setZoom(this.map.getZoom() - 1);
  }

  async showFilter() {
    if (!this.filter.location || this.filter.location.type === 'currentLocation') {
      this.filter.location = {
        type: 'currentLocation',
        currentLocation: this.me.currentLocation
      };
    }

    const modal = await this.modalCtrl.create({
      component: FilterComponent,
      cssClass: 'filter-modal',
      componentProps: {
        me: this.me,
        location: this.filter.location,
        perimeterDiscoverMax: 10,
        perimeterDiscoverValue: (this.filter.perimeterDiscoverValue || 10),
        ageRange: this.filter.ageRange,
        categoryFilter: this.filter.categoryFilter
      }
    });

    modal.present();

    modal.onDidDismiss().then((result) => {
      if (result.data) {
        this.filter = Object.assign(this.filter, result.data);

        if (this.filter.location.type === 'customLocation') {
          this.me.currentLocation.hash = geohashForLocation([
            this.filter.location.currentLocation.lat,
            this.filter.location.currentLocation.lng]);
          this.me.currentLocation.lat = this.filter.location.currentLocation.lat;
          this.me.currentLocation.lng = this.filter.location.currentLocation.lng;
        }

        this.localStorage.setFilter(this.filter).then(() => {
          this.userCollectionService.set(this.me.id, this.me);
        });

        this.loadUsers();
      }
    })
  }

  async showSearch() {
    this.router.navigate(['search']);
  }

  toggleCategories() {
    this.showCategories = !this.showCategories;
  }

  async subscribe(subscription: any) {
    return this.buyService.subscribe(subscription, this.me).then(() => {
      this.ngOnInit();
    })
  }
}
