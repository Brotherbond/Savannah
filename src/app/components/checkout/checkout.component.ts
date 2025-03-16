import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  orderPlaced = false;
  checkoutForm: FormGroup;

  constructor(private cartService: CartService, private fb: FormBuilder, private router: Router) {
    this.checkoutForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10,15}$')]],
      address: ['', [Validators.required, Validators.minLength(10)]],
      city: ['', Validators.required],
      zipCode: ['', [Validators.required, Validators.pattern('^[0-9]{5,6}$')]],
      paymentMethod: ['credit_card', Validators.required]
    });
  }

  ngOnInit(): void {
    this.cartService.cart$.subscribe(cartItems => {
      if (cartItems.length === 0) {
        this.router.navigate(['/']);
      }
    });
  }

  get form() {
    return this.checkoutForm.controls;
  }

  isSubmitted = false;
  submitOrder() {
    this.isSubmitted = true;

    if (this.checkoutForm.invalid) { return; }

    this.placeOrder();
  }

  placeOrder(): void {
    this.orderPlaced = true;
    setTimeout(() => this.cartService.clearCart(), 5000);
  }
}
