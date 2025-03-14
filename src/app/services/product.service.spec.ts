import { HttpClient, provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../environments/environment';
import { Product } from '../models/product.model';
import { ProductService } from './product.service';

describe('ProductService', () => {
  let service: ProductService;
  let httpClient: HttpClient;
  let httpMock: HttpTestingController;
  const API_URL = `${environment.apiUrl}/products`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ProductService,
        provideHttpClient(), provideHttpClientTesting(),],
    });

    service = TestBed.inject(ProductService);
    httpClient = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve all products', () => {
    service.getProducts().subscribe((products) => {
      expect(products.length).toBeGreaterThan(0);
    });
    const req = httpMock.expectOne(API_URL);
    expect(req.request.method).toBe('GET');
  });

  it('should retrieve a product by ID', () => {
    service.getProductById(1).subscribe((res) => {
      expect(res.id).toBe(1);
    });

    const req = httpMock.expectOne(`${API_URL}/1`);
    expect(req.request.method).toBe('GET');
  });

  it('should add a product', () => {
    const newProduct: Product = { id: 3, name: 'Tablet', price: 500 };

    service.addProduct(newProduct).subscribe((res) => {
      expect(res).toEqual(newProduct);
    });

    const req = httpMock.expectOne(API_URL);
    expect(req.request.method).toBe('POST');
    req.flush(newProduct);
  });

  it('should update a product', () => {
    const updatedProduct: Partial<Product> = { price: 1500 };

    service.updateProduct(1, updatedProduct).subscribe((res) => {
      expect(res.price).toBe(1500);
    });

    const req = httpMock.expectOne(`${API_URL}/1`);
    expect(req.request.method).toBe('PATCH');
  });

  it('should delete a product', () => {
    service.deleteProduct(1).subscribe((res) => {
      expect(res).toBeInstanceOf(Object);
    });

    const req = httpMock.expectOne(`${API_URL}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });
});
