import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../models/api-response';

@Injectable({ providedIn: 'root' })
export class QueueTicketService {
  private apiUrl = `${environment.apiUrl}/api/queuetickets`;
  constructor(private http: HttpClient) {}

  getCurrent(): Observable<{ ticketNumber: string }> {
    return this.http.get<ApiResponse<{ ticketNumber: string }>>(`${this.apiUrl}/current`).pipe(map(r => r.results));
  }

  issueTicket(): Observable<{ ticketNumber: string; issuedAt: string }> {
    return this.http.post<ApiResponse<{ ticketNumber: string; issuedAt: string }>>(`${this.apiUrl}/issue`, {}).pipe(map(r => r.results));
  }

  clearQueue(): Observable<{ ticketNumber: string }> {
    return this.http.post<ApiResponse<{ ticketNumber: string }>>(`${this.apiUrl}/clear`, {}).pipe(map(r => r.results));
  }
}
