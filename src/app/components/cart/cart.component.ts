import { Component } from '@angular/core';
import { CartItem } from '../../models/cart-item.model';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent {
  cartItems: CartItem[] = [];
  discountCode = "";

  constructor(private cartService: CartService) {
    this.cartService.cart$.subscribe((items) => (this.cartItems = items));
  }

  removeFromCart(productId: number): void {
    this.cartService.removeFromCart(productId);
  }

  applyDiscount(): void {
    this.cartService.applyDiscount(this.discountCode);
  }

  getTotal(): number {
    return this.cartService.getTotal();
  }

}
