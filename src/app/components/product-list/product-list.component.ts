import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/product.model';
import { CartService } from '../../services/cart.service';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent implements OnInit {
  cart: { [productId: number]: number } = {};
  products: Product[] = [];

  constructor(private cartService: CartService, private productService: ProductService) { }

  ngOnInit(): void {
    this.productService.getProducts().subscribe(products => {
      this.products = products;
    });
    this.cartService.cart$.subscribe(cartItems => {
      this.cart = {};
      cartItems.forEach(item => this.cart[item.product.id] = item.quantity);
    });
  }

  addToCart(product: Product): void {
    this.cartService.addToCart(product);
  }

  handleBlur(productId: number, event: any) {
    const value = Number(event.target.value);
    if (value === 0) {
      this.updateQuantity(productId, 0);
    }
  }

  onQuantityChange(event: any, productId: number) {
    const newQuantity = parseInt(event.target.value, 10);
    if (!isNaN(newQuantity) && newQuantity > 0) {
      this.updateQuantity(productId, newQuantity);
    }
  }

  updateQuantity(productId: number, quantity: number) {
    if (quantity < 0) return;
    this.cartService.updateQuantity(productId, quantity);
  }
}
