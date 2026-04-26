import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../models/api-response';

export interface EmployeeProfile {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  profileBase64: string;
  birthDay: string;
  occupation: string;
  sex: string;
}

@Injectable({ providedIn: 'root' })
export class EmployeeProfileService {
  private apiUrl = `${environment.apiUrl}/api/employeeprofiles`;
  constructor(private http: HttpClient) {}

  getAll(): Observable<EmployeeProfile[]> {
    return this.http.get<ApiResponse<EmployeeProfile[]>>(this.apiUrl).pipe(map(r => r.results));
  }

  create(profile: EmployeeProfile): Observable<{ id: number }> {
    return this.http.post<ApiResponse<{ id: number }>>(this.apiUrl, profile).pipe(map(r => r.results));
  }
}
