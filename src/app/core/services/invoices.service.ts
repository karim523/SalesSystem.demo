import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InvoicesService {

  private readonly _http = inject(HttpClient);
  private readonly baseUrl = `${environment.baseUrl}Invoices`;

  getAllInvoices(): Observable<any> {
    return this._http.get(`${this.baseUrl}`);
  }

  getInvoiceById(id: number): Observable<any> {
    return this._http.get(`${this.baseUrl}/${id}`);
  }

  createInvoice(dto: object): Observable<any> {
    return this._http.post(`${this.baseUrl}`, dto);
  }

  searchInvoices(query: string): Observable<any> {
    return this._http.get(`${this.baseUrl}/search`, {
      params: { query }
    });
  }}
