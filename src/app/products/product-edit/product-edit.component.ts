import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UnitMeasurement } from 'src/app/shared/enums/unit-measurement.enum';
import { format, parse } from 'date-fns'
import { ActivatedRoute, Params, Router } from '@angular/router';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { Product } from 'src/app/shared/models/product.model';

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.scss']
})
export class ProductEditComponent implements OnInit {
  public productForm!: FormGroup;

  public id!: number;

  public products!: Product[];
  public product!: Product;

  public unitOptions: any[] = [];
  public perishableOptions: any[] = [];

  public isExpired: boolean = false;
  public isHigher: boolean = false;

  constructor(
      private formBuilder: FormBuilder, 
      private router: Router,
      private localStorage: LocalStorageService,
      private activatedRoute: ActivatedRoute
    ) {
    this.unitOptions = [
      { name: 'Litro', unit: UnitMeasurement.LITER },
      { name: 'Quilograma', unit: UnitMeasurement.KILOGRAM },
      { name: 'Unidade', unit: UnitMeasurement.UNIT }
    ]
    this.perishableOptions = [
      { name: 'Sim', value: true },
      { name: 'Não', value: false },
    ]
  }

  get unit() {
    return this.productForm.get('unit');
  }

  get quantity() {
    return this.productForm.get('quantity');
  }

  get price() {
    return this.productForm.get('price');
  }

  get validityDate() {
    return this.productForm.get('validityDate');
  }

  public ngOnInit(): void {
    this.products = this.localStorage.get('products');

    this.activatedRoute.params
      .subscribe((params: Params) => {
        this.id = params['id'];

        if (this.id) this.product = this.products[+this.id];
      });

      this.initForm();
  }

  public initForm(): void {
    let name = '';
    let unitMeasurement = null;
    let quantity = 0;
    let price = 0;
    let perishable = false;
    let validityDate = null;
    let manufacturingDate = null; 

    if (this.product) {
      name = this.product.name;
      unitMeasurement = this.product.unitMeasurement;
      quantity = this.product.quantity;
      price = this.product.price;
      perishable = this.product.perishable;
      validityDate = this.product.validityDate ? parse(this.product.validityDate, 'dd/MM/yyyy', new Date()) : null;
      manufacturingDate = parse(this.product.manufacturingDate, 'dd/MM/yyyy', new Date());
    }

    this.productForm = this.formBuilder.group({
      name: [name, [Validators.required, Validators.maxLength(50), Validators.pattern('^[A-Za-z ]+')]],
      unitMeasurement: [unitMeasurement], 
      quantity: [{ value: quantity, disabled: !quantity }, Validators.required],
      price: [price],
      perishable: [perishable],
      validityDate: [{ value: validityDate, disabled: !perishable }],
      manufacturingDate: [manufacturingDate, Validators.required]
    });
  }

  public unitValidatorHandler(event: any): void {
    this.quantity?.enable();

    if (event.value.unitMeasurement === UnitMeasurement.LITER || event.value.unitMeasurement === UnitMeasurement.KILOGRAM) {
      this.quantity?.setValidators(Validators.pattern('^[0-9]{1,11}(?:\.[0-9]{1,3})?$'));
    } else {
      this.quantity?.setValidators(Validators.pattern('^[0-9]*$'));
    }
  }

  public dateValidityHandler(event: any): void {
    const currDate = format(new Date(), 'dd/MM/yyyy');
    const selectDate = format(event, 'dd/MM/yyyy');

    if (currDate > selectDate && selectDate) {
      this.isExpired = true;
    } else {
      this.isExpired = false;
    }
  }

  public perishableValueHandler(event: any): void {
    if (!event.value) {
      this.validityDate?.reset();
      this.validityDate?.disable();
      this.validityDate?.clearValidators();
    } else {
      this.validityDate?.enable();
      this.validityDate?.setValidators(Validators.required);
    }
  }

  public manufacturingDateHandler(event: any): void {
    const dateValidity = format(this.validityDate?.value, 'dd/MM/yyyy');
    const manufacturingDate = format(event, 'dd/MM/yyyy');

    if (manufacturingDate > dateValidity) {
      this.isHigher = true;
    } else {
      this.isHigher = false;
    }
  }

  public back(): void {
    this.router.navigate(['/products']);
  }

  public onSubmit(): void {
    if (!this.productForm.valid || this.isExpired || this.isHigher) {
      return;
    }

    let product = this.productForm.value;

    product.validityDate = product.validityDate ? format(product.validityDate, 'dd/MM/yyyy') : null;
    product.manufacturingDate = format(product.manufacturingDate, 'dd/MM/yyyy');

    if (this.product) {
      this.products[this.id] = product;
    } else {
      this.products.push(product);
    }

    this.localStorage.set('products', this.products);
    this.back();
  }
}
