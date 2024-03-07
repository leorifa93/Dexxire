import {Component, NgZone, OnInit, ViewChild} from '@angular/core';
import {ModalController} from "@ionic/angular";
import { google } from 'google-maps';

@Component({
  selector: 'app-location',
  templateUrl: './location.page.html',
  styleUrls: ['./location.page.scss'],
})
export class LocationPage implements OnInit {
  @ViewChild('searchInput') searchInput ;

  GoogleAutoComplete: any;
  geocoder: any;
  autocomplete: { input: string; };
  autocompleteItems: any[];
  location: any;
  placeid: any;
  locationChecked: boolean = false;
  lat: number = 0;
  lng: number = 0;

  constructor(
    public zone: NgZone,
    public modalCtrl: ModalController
  ) {
    this.GoogleAutoComplete = new google.maps.places.AutocompleteService();
    this.geocoder = new google.maps.Geocoder();
    this.autocomplete = {input: ''};
    this.autocompleteItems = [];
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.searchInput.setFocus();
    }, 500);
  }

  updateSearchResults() {
    if (this.autocomplete.input === '') {
      this.autocompleteItems = [];
      return;
    }

    this.GoogleAutoComplete.getPlacePredictions({
        input: this.autocomplete.input,
        types: ['(cities)']
      },
      (predictions: any) => {
        this.autocompleteItems = [];
        this.zone.run(() => {

          if (predictions) {
            predictions.forEach((prediction: any) => {
              this.autocompleteItems.push(prediction);
            });
          }
        });
      });
  }

  selectSearchResult(event, item) {
    this.locationChecked = event.detail.checked;
    this.location = item;
    this.placeid = this.location.place_id;

    this.geocoder.geocode({
        'placeId': this.placeid
      },
      (responses, status) => {
        if (status == 'OK') {
          this.lat = responses[0].geometry.location.lat();
          this.lng = responses[0].geometry.location.lng();
        }

        this.closeModal();
      });
  }

  closeModal() {
    this.modalCtrl.dismiss({location: this.location, placeId: this.placeid, lat: this.lat, lng: this.lng});
  }
}
