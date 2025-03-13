import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { Product } from '../models/product.model';
import { CartService } from './cart.service';


const mockProduct = (id: number, price?: number): Product => ({
  id,
  name: `Product ${id}`,
  price: price ?? 100 * id
});


describe('CartService', () => {
  let service: CartService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [CartService] });
    service = TestBed.inject(CartService);
    service.clearCart();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Cart Operations', () => {
    const product = mockProduct(1);

    it('should add a product to the cart', async () => {
      service.addToCart(product);
      const cart = await firstValueFrom(service.cart$);
      expect(cart).toEqual([{ product, quantity: 1 }]);
    });

    it('should increase quantity when adding the same product', async () => {
      service.addToCart(product);
      service.addToCart(product);
      const cart = await firstValueFrom(service.cart$);
      expect(cart).toEqual([{ product, quantity: 2 }]);
    });

    it('should remove an item from the cart', async () => {
      service.addToCart(product);
      service.removeFromCart(product.id);
      const cart = await firstValueFrom(service.cart$);
      expect(cart).toEqual([]);
    });
  });

  describe('Cart Calculations', () => {
    it('should return correct subtotal', () => {
      service.addToCart(mockProduct(1));
      service.addToCart(mockProduct(2));
      expect(service.getSubtotal()).toBe(300);
    });
  });

  describe('Discounts', () => {
    it('should apply a valid discount', () => {
      service.addToCart(mockProduct(1));
      service.applyDiscount('SAVE10');
      expect(service.getTotal()).toBe(90);
    });

    it('should not apply an invalid discount', async () => {
      service.addToCart(mockProduct(1));
      service.applyDiscount('INVALID_CODE');
      const error = await firstValueFrom(service.discountError$);
      expect(error).toBe('Invalid Discount Code');
      expect(service.getTotal()).toBe(100);
    });
  });

  describe('Persistence', () => {
    it('should save cart to localStorage', () => {
      service.addToCart(mockProduct(1));
      const storedCart = JSON.parse(localStorage.getItem('cart') || '[]');
      expect(storedCart).toEqual([{ product: mockProduct(1), quantity: 1 }]);
    });

    it('should load cart from localStorage', async () => {
      localStorage.setItem('cart', JSON.stringify([{ product: mockProduct(1), quantity: 1 }]));
      service = new CartService();
      const cart = await firstValueFrom(service.cart$);
      expect(cart).toEqual([{ product: mockProduct(1), quantity: 1 }]);
    });
  });

  describe('Cart Management', () => {
    it('should clear the cart', async () => {
      service.addToCart(mockProduct(1));
      service.clearCart();
      const cart = await firstValueFrom(service.cart$);
      expect(cart).toEqual([]);
      expect(service.getTotal()).toBe(0);
    });

    it('should update product quantity', async () => {
      service.addToCart(mockProduct(1));
      service.updateQuantity(1, 3);
      const cart = await firstValueFrom(service.cart$);
      expect(cart).toEqual([{ product: mockProduct(1), quantity: 3 }]);
    });

    it('should remove product when quantity is set to zero', async () => {
      service.addToCart(mockProduct(1));
      service.updateQuantity(1, 0);
      const cart = await firstValueFrom(service.cart$);
      expect(cart).toEqual([]);
    });

    it('should prevent setting negative quantity', async () => {
      service.addToCart(mockProduct(1));
      service.updateQuantity(1, -5);
      const cart = await firstValueFrom(service.cart$);
      expect(cart).toEqual([{ product: mockProduct(1), quantity: 1 }]);
    });
  });
});
