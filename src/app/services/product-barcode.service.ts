import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../models/api-response';

export interface ProductBarcode {
  id?: number;
  code: string;
  barcodeBase64?: string;
}

@Injectable({ providedIn: 'root' })
export class ProductBarcodeService {
  private apiUrl = `${environment.apiUrl}/api/productbarcodes`;
  constructor(private http: HttpClient) {}

  getAll(): Observable<ProductBarcode[]> {
    return this.http.get<ApiResponse<ProductBarcode[]>>(this.apiUrl).pipe(map(r => r.results));
  }

  create(item: ProductBarcode): Observable<{ id: number }> {
    return this.http.post<ApiResponse<{ id: number }>>(this.apiUrl, item).pipe(map(r => r.results));
  }

  delete(id: number): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.apiUrl}/${id}`);
  }
}
