import { Component, OnInit } from '@angular/core';
import { AbstractModalController } from '../../controller/ModalController';
import { ModalController } from '@ionic/angular';
import { CountriesService } from '../../services/countries.service';

@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.scss'],
})
export class CountriesComponent extends AbstractModalController  implements OnInit {
  countries: { country: string, key: string, region: string, flag: string }[] = [];
  searchString: string;

  constructor(protected modalCtrl: ModalController, private countriesService: CountriesService) { 
    super(modalCtrl);

    this.countriesService.getAll().then(countries => this.countries = countries);
  }

  ngOnInit() {}

  selectCountry(country: any) {
    this.modalCtrl.dismiss({
      country: country
    });
  }
}
