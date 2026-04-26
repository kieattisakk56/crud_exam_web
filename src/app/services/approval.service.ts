import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../models/api-response';

export interface ApprovalDocument {
  id?: number;
  title: string;
  description: string;
  reason: string;
  status: number;
  approvedAt?: string;
  approvedBy?: string;
}

@Injectable({ providedIn: 'root' })
export class ApprovalService {
  private apiUrl = `${environment.apiUrl}/api/approvaldocuments`;
  constructor(private http: HttpClient) {}

  getAll(): Observable<ApprovalDocument[]> {
    return this.http.get<ApiResponse<ApprovalDocument[]>>(this.apiUrl).pipe(map(r => r.results));
  }

  create(doc: ApprovalDocument): Observable<{ id: number }> {
    return this.http.post<ApiResponse<{ id: number }>>(this.apiUrl, doc).pipe(map(r => r.results));
  }

  approve(ids: number[], reason: string): Observable<ApiResponse<null>> {
    return this.http.put<ApiResponse<null>>(`${this.apiUrl}/approve`, { ids, reason });
  }

  reject(ids: number[], reason: string): Observable<ApiResponse<null>> {
    return this.http.put<ApiResponse<null>>(`${this.apiUrl}/reject`, { ids, reason });
  }
}
