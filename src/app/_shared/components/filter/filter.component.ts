import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {AbstractModalController} from "../../controller/ModalController";
import {ModalController} from "@ionic/angular";
import {IUser} from "../../../interfaces/i-user";
import {LocationService} from "../../services/location.service";
import {LocationPage} from "../../pages/location/location.page";
import {Distance, Weight} from "../../../constants/Units";
import {UserCollectionService} from "../../../services/user/user-collection.service";
import {Gender} from "../../../constants/User";
import {ProfileHelper} from "../../helper/Profile";
import { google } from 'google-maps';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
})
export class FilterComponent extends AbstractModalController implements OnInit {

  @ViewChild('mapElement') mapNativeElement: ElementRef;
  @Input() me: IUser;
  @Input() type: 'discover' | 'world' = 'discover';
  @Input() perimeterMax: number = 100;
  @Input() perimeterDiscoverMax: number = 10;
  @Input() perimeterValue: number = 100;
  @Input() perimeterDiscoverValue: number = 10;
  @Input() ageRange: { lower: number, upper: number } = {
    lower: 18,
    upper: 80
  }
  @Input() location: { type: string, currentLocation: any };
  categories: any[] = [];
  map: any;
  @Input() categoryFilter: any[] = [];
  showCategories: boolean = true;
  genders: { key: Gender, value: string }[] = [
    {key: Gender.Male, value: 'MALE'},
    {key: Gender.Female, value: 'FEMALE'},
    {key: Gender.Transsexual, value: 'TRANSSEXUAL'}
  ]
  blocklist: string[] = ['xf3WOgBpmoMcdDC8xJb207MX3an2', 'mw2OPKQjAbOQHSBkxvJIzYiGIsi1'];
  
  constructor(protected modalCtrl: ModalController, private locationService: LocationService,
              private userCollectionService: UserCollectionService) {
    super(modalCtrl);
  }

  ngOnInit() {
    this.userCollectionService.getAll(20, null, [{
      key: "genders",
      opr: 'array-contains-any',
      value: this.me.genderLookingFor
    }], undefined, 'UserCategories').then((result) => {
      this.categories = result;
    });

    if (this.me._settings.units.distanceType === Distance.Mi) {
      this.perimeterValue = Math.round(this.perimeterValue / 0.621371);
      this.perimeterDiscoverValue = Math.round(this.perimeterDiscoverValue / 0.621371);
      this.perimeterMax = Math.round(this.perimeterMax / 0.621371);
      this.perimeterDiscoverMax = Math.round(this.perimeterDiscoverMax / 0.621371);
    }
  }

  ngAfterViewInit() {
    this.renderMaps();
  }

  selectGenderFor(gender: Gender) {
    if (!this.me.genderLookingFor) {
      this.me.genderLookingFor = [];
    }

    if (this.me.genderLookingFor.includes(gender)) {
      this.me.genderLookingFor.splice(this.me.genderLookingFor.indexOf(gender), 1);
    } else {
      this.me.genderLookingFor.push(gender);
    }

    document.dispatchEvent(new CustomEvent('user', {
      detail: {
        user: this.me
      }
    }));
  }

  toggleCategory(category: string) {
    if (!this.categoryFilter) {
      this.categoryFilter = [];
    }

    if (this.categoryFilter.includes(category)) {
      this.categoryFilter = this.categoryFilter.filter(c => {
        return c !== category;
      });
    } else {
      this.categoryFilter.push(category);
    }
  }

  toggleCategories() {
    this.showCategories = !this.showCategories;
  }

  renderMaps() {
    this.map = new google.maps.Map(this.mapNativeElement.nativeElement, {
      scrollwheel: false,
      fullscreenControl: false,
      streetViewControl: false,
      disableDefaultUI: true,
      center: {lat: this.location.currentLocation.lat, lng: this.location.currentLocation.lng},
      zoom: 16,
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

    var marker = new google.maps.Marker({
      position: {
        lat: this.location.currentLocation.lat,
        lng: this.location.currentLocation.lng
      },
      map: this.map
    });

    this.map.setCenter({
      lat: this.location.currentLocation.lat,
      lng: this.location.currentLocation.lng
    });

    google.maps.event.addListener(this.map, 'bounds_changed', () => {
      const bounds = this.map.getBounds();
      var ne = bounds.getNorthEast();
      var sw = bounds.getSouthWest();
      var lat1 = ne.lat();
      var lat2 = sw.lat();
      var lng1 = ne.lng();
      var lng2 = sw.lng();

      var rectangle = new google.maps.Polygon({
        paths: [
          new google.maps.LatLng(lat1, lng1),
          new google.maps.LatLng(lat2, lng1),
          new google.maps.LatLng(lat2, lng2),
          new google.maps.LatLng(lat1, lng2)
        ],
        strokeOpacity: 0,
        fillOpacity: 0,
        map: this.map
      });
      google.maps.event.addListener(rectangle, 'click', (args) => {
        this.location.type = 'customLocation';
        this.location.currentLocation = {
          lat: args.latLng.lat(),
          lng: args.latLng.lng(),
        };

        marker.setPosition(args.latLng);
        this.map.setCenter(marker.getPosition());
      });
    });
  }

  setDistance(e: any) {
    if (this.type === 'world') {
      this.perimeterValue = e.detail.value;
    } else {
      this.perimeterDiscoverValue = e.detail.value;
    }
  }

  setAgeRange(e: any) {
    this.ageRange = e.detail.value;
  }

  async showLocations() {
    const modal = await this.modalCtrl.create({
      component: LocationPage
    });

    modal.onDidDismiss().then((result) => {
      if (result.data) {
        this.location.type = 'customLocation';
        const randomLocation = ProfileHelper.randomGeo({
          latitude: result.data.lat,
          longitude: result.data.lng
        }, 5000);


        this.location.currentLocation = {
          lat: randomLocation.latitude,
          lng: randomLocation.longitude,
        };

        this.renderMaps();
      }
    })

    return modal.present();
  }

  zoomIn() {
    this.map.setZoom(this.map.getZoom() + 1);
  }

  zoomOut() {
    this.map.setZoom(this.map.getZoom() - 1);
  }
  async setCurrentLocation() {
    this.location.type = 'currentLocation';
    this.location.currentLocation = await this.locationService.detectCurrentLocation();

    this.renderMaps();
  }

  apply() {
    if (this.me._settings.units.distanceType === Distance.Mi) {
      this.perimeterValue = Math.round(this.perimeterValue * 0.621371);
      this.perimeterDiscoverValue = Math.round(this.perimeterDiscoverValue * 0.621371);
    }

    return this.modalCtrl.dismiss({
      location: this.location,
      perimeterValue: this.perimeterValue,
      ageRange: this.ageRange,
      perimeterDiscoverValue: this.perimeterDiscoverValue,
      categoryFilter: this.categoryFilter
    })
  }
}
