import { HttpClient, provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../environments/environment';
import { Discount } from '../models/discount.model';
import { DiscountService } from './discount.service';

describe('DiscountService', () => {
  let service: DiscountService;
  let httpClient: HttpClient;
  let httpMock: HttpTestingController;
  const API_URL = `${environment.apiUrl}/discounts`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DiscountService,
        provideHttpClient(), provideHttpClientTesting(),],
    });


    service = TestBed.inject(DiscountService);
    httpClient = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve all discounts', () => {
    const dummyDiscounts: Discount[] = [
      { id: 1, code: 'SAVE10', type: 'percent', value: 10 },
      { id: 2, code: 'SAVE5', type: 'fixed', value: 5 },
    ];

    service.getDiscounts().subscribe((discounts) => {
      expect(discounts.length).toBe(2);
      expect(discounts).toEqual(dummyDiscounts);
    });

    const req = httpMock.expectOne(API_URL);
    expect(req.request.method).toBe('GET');
    req.flush(dummyDiscounts);
  });

  it('should retrieve a discount by ID', () => {
    const discount: Discount = { id: 1, code: 'SAVE10', type: 'percent', value: 10 };

    service.getDiscountById(1).subscribe((res) => {
      expect(res).toEqual(discount);
    });

    const req = httpMock.expectOne(`${API_URL}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(discount);
  });

  it('should add a discount', () => {
    const newDiscount: Discount = { id: 3, code: 'SAVE20', type: 'percent', value: 20 };

    service.addDiscount(newDiscount).subscribe((res) => {
      expect(res).toEqual(newDiscount);
    });

    const req = httpMock.expectOne(API_URL);
    expect(req.request.method).toBe('POST');
    req.flush(newDiscount);
  });

  it('should update a discount', () => {
    const updatedDiscount: Partial<Discount> = { value: 15 };

    service.updateDiscount(1, updatedDiscount).subscribe((res) => {
      expect(res.value).toBe(15);
    });

    const req = httpMock.expectOne(`${API_URL}/1`);
    expect(req.request.method).toBe('PATCH');
    req.flush({ id: 1, code: 'SAVE10', type: 'percent', value: 15 });
  });

  it('should delete a discount', () => {
    service.deleteDiscount(1).subscribe((res) => {
      expect(res).toBeInstanceOf(Object);
    });

    const req = httpMock.expectOne(`${API_URL}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  it('should validate a discount by code', () => {
    const discounts: Discount[] = [{ id: 1, code: 'SAVE10', type: 'percent', value: 10 }];

    service.validateDiscount('SAVE10').subscribe((res) => {
      expect(res).toEqual(discounts[0]);
    });

    const req = httpMock.expectOne(`${API_URL}?code=SAVE10`);
    expect(req.request.method).toBe('GET');
    req.flush(discounts);
  });
});
