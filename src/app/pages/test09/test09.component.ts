import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PostCommentService, Post, Comment } from '../../services/post-comment.service';

@Component({
  selector: 'app-test09',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './test09.component.html',
  styleUrl: './test09.component.scss'
})
export class Test09Component implements OnInit, AfterViewChecked {
  @ViewChild('commentList') private commentListContainer!: ElementRef;

  post: Post | null = null;
  comments: Comment[] = [];
  newComment: string = '';
  currentUser: string = 'Blend 285';
  private shouldScrollToBottom = false;

  constructor(private postCommentService: PostCommentService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadData();
  }

  ngAfterViewChecked() {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }

  loadData() {
    this.postCommentService.getPosts().subscribe({
      next: (posts) => {
        if (posts.length > 0) {
          this.post = posts[0];
          this.loadComments(this.post.id);
        }
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }

  loadComments(postId: number) {
    this.postCommentService.getCommentsByPostId(postId).subscribe({
      next: (data) => {
        this.comments = data;
        this.shouldScrollToBottom = true;
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }

  addComment() {
    if (this.newComment.trim() && this.post) {
      this.postCommentService.createComment(this.post.id, this.currentUser, this.newComment.trim()).subscribe({
        next: () => {
          this.newComment = '';
          this.loadComments(this.post!.id);
        },
        error: (err) => console.error(err)
      });
    }
  }

  scrollToBottom(): void {
    try {
      this.commentListContainer.nativeElement.scrollTop = this.commentListContainer.nativeElement.scrollHeight;
    } catch (err) {}
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.addComment();
    }
  }
}
