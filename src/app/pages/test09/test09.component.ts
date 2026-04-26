import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { PostCommentService, PostComment } from '../../services/post-comment.service';

@Component({
  selector: 'app-test09',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './test09.component.html',
  styleUrl: './test09.component.scss'
})
export class Test09Component implements OnInit {
  newComment: string = '';
  comments: PostComment[] = [];
  currentUser: string = 'Blend 285';

  constructor(private commentService: PostCommentService, private cdr: ChangeDetectorRef) {}

  ngOnInit() { this.loadData(); }

  loadData() {
    this.commentService.getAll().subscribe({
      next: (data) => { this.comments = data; this.cdr.detectChanges(); },
      error: (err) => console.error(err)
    });
  }

  addComment() {
    if (this.newComment.trim()) {
      this.commentService.create({ commenterName: this.currentUser, commentText: this.newComment.trim() }).subscribe({
        next: () => { this.newComment = ''; this.loadData(); },
        error: (err) => console.error(err)
      });
    }
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') this.addComment();
  }
}
