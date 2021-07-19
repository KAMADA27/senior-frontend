import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { format } from 'date-fns';
import { PrimeNGConfig } from 'primeng/api';
import { UnitMeasurement } from './shared/enums/unit-measurement.enum';
import { Product } from './shared/models/product.model';
import { LocalStorageService } from './shared/services/local-storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public products: Product[];

  constructor(
    private config: PrimeNGConfig,
    private localService: LocalStorageService, 
    public translateService: TranslateService
  ) {
    this.products = [
      { name: 'Leite', unitMeasurement: UnitMeasurement.LITER, quantity: 10, price: 2, perishable: true, validityDate: format(new Date, 'dd/MM/yyyy'), manufacturingDate: format(new Date, 'dd/MM/yyyy') },
    ];
  }

  public ngOnInit(): void {
    this.translateService.setDefaultLang('pt-br');
    this.localService.set("products", this.products);
  }

  public translate(lang: string): void {
    this.translateService.use(lang);
    this.translateService.get('primeng').subscribe(res => this.config.setTranslation(res));
  }
}
