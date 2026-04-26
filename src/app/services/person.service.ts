import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../models/api-response';

export interface Person {
  id?: number;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  address: string;
  age?: number;
}

@Injectable({ providedIn: 'root' })
export class PersonService {
  private apiUrl = `${environment.apiUrl}/api/persons`;
  constructor(private http: HttpClient) {}

  getPersons(): Observable<Person[]> {
    return this.http.get<ApiResponse<Person[]>>(this.apiUrl).pipe(map(r => r.results));
  }

  addPerson(person: Person): Observable<{ id: number }> {
    return this.http.post<ApiResponse<{ id: number }>>(this.apiUrl, person).pipe(map(r => r.results));
  }
}
