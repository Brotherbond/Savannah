import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideToastr } from 'ngx-toastr';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { Discount } from '../models/discount.model';
import { Product } from '../models/product.model';
import { NotificationService } from '../shared/services/notification.service';
import { CartService } from './cart.service';
import { DiscountService } from './discount.service';
import { ProductService } from './product.service';
import { CartItem } from '../models/cart-item.model';

describe('CartService', () => {
  let httpMock: HttpTestingController;
  let discountService: DiscountService;
  let productService: ProductService;
  let service: CartService;
  const API_URL = `${environment.apiUrl}/products`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CartService, DiscountService,
        NotificationService, ProductService,
        provideHttpClient(), provideHttpClientTesting(),
        provideToastr()
      ],
    });

    discountService = TestBed.inject(DiscountService);
    productService = TestBed.inject(ProductService);
    service = TestBed.inject(CartService);
    httpMock = TestBed.inject(HttpTestingController);
    service.clearCart();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  async function mockProductFetch(id: number, price: number): Promise<Product> {
    const product = firstValueFrom(productService.getProductById(id));
    const req = httpMock.expectOne(`${API_URL}/${id}`);
    req.flush({ id, name: `Product ${id}`, price });
    return await product;
  }

  describe('Cart Operations', () => {
    let product: Product;

    beforeEach(async () => {
      product = await mockProductFetch(1, 100);
    });

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
    it('should return correct subtotal', async () => {
      const product1 = await mockProductFetch(1, 100);
      const product2 = await mockProductFetch(2, 200);

      service.addToCart(product1);
      service.addToCart(product2);

      expect(service.getSubtotal()).toBe(300);
    });
  });

  describe('Discounts', () => {
    let product: Product;

    beforeEach(async () => {
      product = await mockProductFetch(1, 100);
    });

    it('should apply a valid discount', () => {
      service.addToCart(product);
      const discount: Discount = { id: 1, code: 'SAVE10', type: 'percent', value: 10 };
      discountService.getDiscountById(1).subscribe((discount) => {
        service.applyDiscount(discount.code);
        expect(service.getTotal()).toBe(product.price);
        httpMock.expectOne(`${environment.apiUrl}/discounts?code=${discount.code}`);
      });
      const req = httpMock.expectOne(`${environment.apiUrl}/discounts/1`);
      expect(req.request.method).toBe('GET');
      req.flush(discount);
    });

    it('should not apply an invalid discount', async () => {
      const INVALID_CODE = 'INVALID_CODE';
      service.addToCart(product);
      service.applyDiscount(INVALID_CODE);
      const req = httpMock.expectOne(`${environment.apiUrl}/discounts?code=${INVALID_CODE}`);
      expect(req.request.method).toBe('GET');
      req.flush(null);
      const error = await firstValueFrom(service.discountError$);
      expect(service.getTotal()).toBe(product.price);
      expect(error).toBe('Invalid Discount Code');
    });
  });

  describe('Persistence', () => {
    let product: Product, mockCart: CartItem[];

    beforeEach(async () => {
      localStorage.clear();
      product = await mockProductFetch(1, 100);
      mockCart = [{ product, quantity: 1 }];
      spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(mockCart));
      service = TestBed.inject(CartService);
      (service as any).loadCart();
    });

    it('should save cart to localStorage', async () => {
      service.addToCart(product);
      const storedCart = JSON.parse(localStorage.getItem('cart') || '[]');
      expect(storedCart).toEqual(mockCart);
    });

    it('should load cart from localStorage', async () => {
      const cart = await firstValueFrom(service.cart$);
      expect(cart).toEqual(mockCart);
    });
  });

  describe('Cart Management', () => {
    let product: Product;

    beforeEach(async () => {
      product = await mockProductFetch(1, 100);
    });

    it('should clear the cart', async () => {
      service.addToCart(product);
      service.clearCart();
      const cart = await firstValueFrom(service.cart$);
      expect(cart).toEqual([]);
      expect(service.getTotal()).toBe(0);
    });

    it('should update product quantity', async () => {
      service.addToCart(product);
      service.updateQuantity(1, 3);
      const cart = await firstValueFrom(service.cart$);
      expect(cart).toEqual([{ product, quantity: 3 }]);
    });
  });
});
