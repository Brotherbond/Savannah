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

  applyDiscount(): void {
    this.cartService.applyDiscount(this.discountCode);
  }

  checkout() {
    alert("Proceeding to checkout...");
  }

  getTotal(): number {
    return this.cartService.getTotal();
  }

  handleBlur(productId: number, event: any) {
    const value = Number(event.target.value);
    if (value === 0) {
      this.removeFromCart(productId);
    }
  }

  updateQuantity(productId: number, newQuantity: number) {
    if (newQuantity >= 1) {
      this.cartItems = this.cartItems.map(item =>
        item.product.id === productId ? { ...item, quantity: newQuantity } : item
      );
    }
  }

  onQuantityChange(event: any, productId: number) {
    const value = Number(event.target.value);
    if (!isNaN(value) && value >= 1) {
      this.updateQuantity(productId, value);
    }
  }

  removeFromCart(productId: number) {
    this.cartService.removeFromCart(productId);
  }
}
