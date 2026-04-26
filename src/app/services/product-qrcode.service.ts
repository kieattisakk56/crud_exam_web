import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../models/api-response';

export interface ProductQrCode { id?: number; code: string; }

@Injectable({ providedIn: 'root' })
export class ProductQrCodeService {
  private apiUrl = `${environment.apiUrl}/api/productqrcodes`;
  constructor(private http: HttpClient) {}

  getAll(): Observable<ProductQrCode[]> {
    return this.http.get<ApiResponse<ProductQrCode[]>>(this.apiUrl).pipe(map(r => r.results));
  }

  create(item: ProductQrCode): Observable<{ id: number }> {
    return this.http.post<ApiResponse<{ id: number }>>(this.apiUrl, item).pipe(map(r => r.results));
  }

  delete(id: number): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.apiUrl}/${id}`);
  }
}
