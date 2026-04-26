import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../models/api-response';

export interface ExamChoice {
  choiceNumber: number;
  choiceText: string;
}

export interface ExamQuestion {
  id?: number;
  questionNumber: number;
  questionText: string;
  choices: ExamChoice[];
  correctAnswer: number;
}

@Injectable({ providedIn: 'root' })
export class ExamQuestionService {
  private apiUrl = `${environment.apiUrl}/api/examquestions`;
  constructor(private http: HttpClient) {}

  getAll(): Observable<ExamQuestion[]> {
    return this.http.get<ApiResponse<ExamQuestion[]>>(this.apiUrl).pipe(map(r => r.results));
  }

  create(item: { questionText: string; choices: string[]; correctAnswer: number }): Observable<{ id: number }> {
    return this.http.post<ApiResponse<{ id: number }>>(this.apiUrl, item).pipe(map(r => r.results));
  }

  delete(id: number): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.apiUrl}/${id}`);
  }
}
