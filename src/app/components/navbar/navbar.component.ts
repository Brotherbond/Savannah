import { Component } from '@angular/core';
import { CartItem } from '../../models/cart-item.model';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  cartItems: CartItem[] = [];

  constructor(private cartService: CartService) { }

  ngOnInit() {
    this.cartService.cart$.subscribe(cartItems => {
      this.cartItems = cartItems;
    });
  }

  getCartItemCount(): number {
    return this.cartItems.length;
  }
}
