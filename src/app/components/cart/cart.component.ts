import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CartItem } from '../../models/cart-item.model';
import { CartService } from '../../services/cart.service';
import { NotificationService } from '../../shared/services/notification.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent {
  cartItems$!: Observable<CartItem[]>;
  total$: number = 0;
  discountCode = "";
  isDiscountApplied = false;
  constructor(private cartService: CartService, private notificationService: NotificationService, private router: Router) {
    (this.cartItems$ = this.cartService.cart$).subscribe(cartItems => this.total$ = this.cartService.getTotal());
    this.cartService.discountCode$.subscribe(code => {
      this.isDiscountApplied = !!code;
      if (code) this.discountCode = code;
      this.total$ = this.cartService.getTotal();
    });
  }

  applyDiscount(): void {
    if (this.discountCode.trim()) {
      this.cartService.applyDiscount(this.discountCode);
    }
  }

  checkout(): void {
    this.notificationService.success("Proceeding to checkout...", "Cart");
    this.router.navigate(['/checkout']);
  }

  handleBlur(productId: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = Number(input.value);

    if (value < 1) {
      input.value = '1';
      this.updateQuantity(productId, 1);
    }
  }

  onDiscountInputChange(): void {
    this.cartService.clearDiscount();
  }

  onQuantityChange(event: Event, productId: number): void {
    const input = event.target as HTMLInputElement;
    const value = Number(input.value);

    if (!isNaN(value) && value >= 1) {
      this.updateQuantity(productId, value);
    }
  }

  removeFromCart(productId: number): void {
    this.cartService.removeFromCart(productId);
  }

  trackById(index: number, item: CartItem): number {
    return item.product.id;
  }

  updateQuantity(productId: number, newQuantity: number): void {
    if (newQuantity >= 1) {
      this.cartService.updateQuantity(productId, newQuantity);
    }
  }
}
