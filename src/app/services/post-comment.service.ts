import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../models/api-response';

export interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  imageUrl: string;
  createdAt: string;
}

export interface Comment {
  id: number;
  postId: number;
  commenterName: string;
  commentText: string;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class PostCommentService {
  private postsUrl = `${environment.apiUrl}/api/posts`;
  private commentsUrl = `${environment.apiUrl}/api/comments`;

  constructor(private http: HttpClient) {}

  getPosts(): Observable<Post[]> {
    return this.http.get<ApiResponse<Post[]>>(this.postsUrl).pipe(map(r => r.results));
  }

  getCommentsByPostId(postId: number): Observable<Comment[]> {
    return this.http.get<ApiResponse<Comment[]>>(`${this.commentsUrl}/post/${postId}`).pipe(map(r => r.results));
  }

  createComment(postId: number, commenterName: string, commentText: string): Observable<{ id: number }> {
    // Note: You might need to implement CreateCommentCommand on the backend if not already there
    return this.http.post<ApiResponse<{ id: number }>>(`${this.commentsUrl}`, { postId, commenterName, commentText }).pipe(map(r => r.results));
  }
}
