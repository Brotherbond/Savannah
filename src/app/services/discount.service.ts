import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Discount } from '../models/discount.model';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root',
})
export class DiscountService {
  private readonly API_URL = `${environment.apiUrl}/discounts`;


  constructor(private http: HttpClient) { }

  getDiscounts(): Observable<Discount[]> {
    return this.http.get<Discount[]>(this.API_URL);
  }

  getDiscountById(id: number): Observable<Discount> {
    return this.http.get<Discount>(`${this.API_URL}/${id}`);
  }

  addDiscount(discount: Discount): Observable<Discount> {
    return this.http.post<Discount>(this.API_URL, discount);
  }

  updateDiscount(id: number, discount: Partial<Discount>): Observable<Discount> {
    return this.http.patch<Discount>(`${this.API_URL}/${id}`, discount);
  }

  deleteDiscount(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }

  validateDiscount(code: string): Observable<Discount | null> {
    return this.http.get<Discount[]>(`${this.API_URL}?code=${code}`).pipe(
      map((discounts: Discount[]) => (discounts.length > 0 ? discounts[0] : null))
    );
  }
}
