import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../models/api-response';

export interface PostComment { id?: number; commenterName: string; commentText: string; }

@Injectable({ providedIn: 'root' })
export class PostCommentService {
  private apiUrl = `${environment.apiUrl}/api/postcomments`;
  constructor(private http: HttpClient) {}

  getAll(): Observable<PostComment[]> {
    return this.http.get<ApiResponse<PostComment[]>>(this.apiUrl).pipe(map(r => r.results));
  }

  create(item: PostComment): Observable<{ id: number }> {
    return this.http.post<ApiResponse<{ id: number }>>(this.apiUrl, item).pipe(map(r => r.results));
  }
}
