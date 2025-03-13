import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { CartItem } from "../models/cart-item.model";
import { Discount } from "../models/discount.model";
import { DiscountService } from "./discount.service";

@Injectable({
  providedIn: "root",
})
export class CartService {
  private cartItems: CartItem[] = [];
  private readonly cartSubject = new BehaviorSubject<CartItem[]>([]);
  readonly cart$ = this.cartSubject.asObservable();

  private discount: Discount | null = null;
  private readonly discountCodeSubject = new BehaviorSubject<string>('');
  private readonly discountErrorSubject = new BehaviorSubject<string>('');
  readonly discountCode$ = this.discountCodeSubject.asObservable();
  readonly discountError$ = this.discountErrorSubject.asObservable();


  constructor(private discountService: DiscountService) {
    this.loadCart();
  }

  addToCart(product: CartItem["product"]): void {
    const item = this.cartItems.find((i) => i.product.id === product.id);
    if (item) {
      item.quantity++;
    } else {
      this.cartItems.push({ product, quantity: 1 });
    }
    this.updateCart();
  }

  applyDiscount(code: string): void {
    this.discountService.validateDiscount(code).subscribe((discount) => {
      this.clearDiscountError();
      if (discount) {
        this.discount = discount;
        this.discountCodeSubject.next(code);
      }
      this.discountErrorSubject.next("Invalid Discount Code");
    });
  }

  clearCart(): void {
    this.cartItems = [];
    this.discount = null;
    this.discountCodeSubject.next('');
    this.clearDiscountError();
    this.updateCart();
  }

  clearDiscountError(): void {
    this.discountErrorSubject.next('');
  }

  getSubtotal(): number {
    return this.cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }

  getTotal(): number {
    const subtotal = this.getSubtotal();
    if (!this.discount) return subtotal;

    const total = this.discount.type === 'percent'
      ? subtotal * (1 - this.discount.value / 100)
      : subtotal - this.discount.value;

    return Math.max(total, 0);
  }

  private loadCart(): void {
    try {
      const storedCart = localStorage.getItem('cart');
      if (storedCart) {
        this.cartItems = JSON.parse(storedCart);
        this.cartSubject.next([...this.cartItems]);
      }
    } catch (error) {
      console.error('Error loading cart from storage:', error);
      this.cartItems = [];
      this.saveCart();
    }
  }

  removeFromCart(productId: number): void {
    const initialLength = this.cartItems.length;
    this.cartItems = this.cartItems.filter(item => item.product.id !== productId);
    if (initialLength !== this.cartItems.length) {
      this.updateCart();
    }
  }

  private saveCart(): void {
    try {
      localStorage.setItem('cart', JSON.stringify(this.cartItems));
    } catch (error) {
      console.error('Error saving cart to storage:', error);
    }
  }

  private updateCart(): void {
    this.saveCart();
    this.cartSubject.next([...this.cartItems]);
  }

  updateQuantity(productId: number, quantity: number) {
    if (quantity < 0) return;

    const item = this.cartItems.find(item => item.product.id === productId);

    if (!item) {
      console.error('Product not found:', productId);
      return;
    }
    if (quantity === 0) {
      this.removeFromCart(productId);
    } else {
      item.quantity = quantity;
      this.updateCart();
    }
  }
}
