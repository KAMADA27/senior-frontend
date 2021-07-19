import { Component, OnInit } from '@angular/core';
import { Product } from '../../shared/models/product.model';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  public products: Product[] = [];

  constructor(
    private localStorage: LocalStorageService, 
    private router: Router,
    private activatedRoute: ActivatedRoute,  
    private confirmationService: ConfirmationService,
  ) {}

  ngOnInit(): void {
    this.products = this.localStorage.get("products");
  }

  public addProduct(): void {
    this.router.navigate(['new'], { relativeTo: this.activatedRoute });
  }

  public removeProduct(index: number): void {
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja remover o produto?',
      accept: () => {
        this.products.splice(index, 1);
        localStorage.setItem('products', JSON.stringify(this.products));
      }
    })
  }

  public editProduct(index: number): void {
    this.router.navigate(['edit', index], { relativeTo: this.activatedRoute });
  }
}
