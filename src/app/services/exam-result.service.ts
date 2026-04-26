import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../models/api-response';

export interface ExamChoiceView {
  choiceNumber: number;
  choiceText: string;
}

export interface ExamQuestionView {
  id: number;
  questionNumber: number;
  questionText: string;
  choices: ExamChoiceView[];
}

export interface ExamSubmitDto {
  examineeName: string;
  answers: { questionId: number; selectedAnswer: number }[];
}

export interface ExamResultDto {
  score: number;
  totalQuestions: number;
  examineeName: string;
  id: number;
}

@Injectable({ providedIn: 'root' })
export class ExamResultService {
  private apiUrl = `${environment.apiUrl}/api/examresults`;
  constructor(private http: HttpClient) {}

  getQuestions(): Observable<ExamQuestionView[]> {
    return this.http.get<ApiResponse<ExamQuestionView[]>>(`${this.apiUrl}/questions`).pipe(map(r => r.results));
  }

  submitExam(dto: ExamSubmitDto): Observable<ExamResultDto> {
    return this.http.post<ApiResponse<ExamResultDto>>(`${this.apiUrl}/submit`, dto).pipe(map(r => r.results));
  }
}
