import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private readonly _HttpClient = inject(HttpClient);
  private readonly baseUrl = `${environment.baseUrl}Products`;

  getAllProducts(): Observable<any> {
    return this._HttpClient.get(`${this.baseUrl}`);
  }

  getSpecificProduct(id: number): Observable<any> {
    return this._HttpClient.get(`${this.baseUrl}/${id}`);
  }


  searchProducts(query: string): Observable<any> {
    return this._HttpClient.get(`${this.baseUrl}/search`, {
      params: { query }
    });
  }

  getLowStockProducts(): Observable<any> {
    return this._HttpClient.get(`${this.baseUrl}/low-stock`);
  }

  createProduct(product: object): Observable<any> {
    return this._HttpClient.post(`${this.baseUrl}`, product);
  }

  updateProduct(id: number, product: object): Observable<any> {
    return this._HttpClient.put(`${this.baseUrl}/${id}`, product);
  }

  deleteProduct(id: number): Observable<any> {
    return this._HttpClient.delete(`${this.baseUrl}/${id}`);
  }

}
