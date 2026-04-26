import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { ExamResultService, ExamQuestionView } from '../../services/exam-result.service';

interface QuestionState extends ExamQuestionView {
  selectedAnswer: number | null;
}

@Component({
  selector: 'app-test10',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './test10.component.html',
  styleUrl: './test10.component.scss'
})
export class Test10Component implements OnInit {
  viewMode: 'exam' | 'result' = 'exam';
  examineeName: string = '';
  score: number = 0;
  totalQuestions: number = 0;
  questions: QuestionState[] = [];

  constructor(private examResultService: ExamResultService, private cdr: ChangeDetectorRef) {}

  ngOnInit() { this.loadQuestions(); }

  loadQuestions() {
    this.examResultService.getQuestions().subscribe({
      next: (data) => {
        this.questions = data.map(q => ({ ...q, selectedAnswer: null }));
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }

  submitExam() {
    if (!this.examineeName.trim()) { alert('กรุณากรอก ชื่อ-สกุล ก่อนส่งข้อสอบ'); return; }
    if (this.questions.some(q => q.selectedAnswer === null)) { alert('กรุณาทำข้อสอบให้ครบทุกข้อ'); return; }

    const dto = {
      examineeName: this.examineeName,
      answers: this.questions.map(q => ({ questionId: q.id, selectedAnswer: q.selectedAnswer! }))
    };

    this.examResultService.submitExam(dto).subscribe({
      next: (res) => {
        this.score = res.score;
        this.totalQuestions = res.totalQuestions;
        this.viewMode = 'result';
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }

  retakeExam() {
    this.examineeName = '';
    this.score = 0;
    this.viewMode = 'exam';
    this.loadQuestions();
  }

  choiceLabel(index: number): string {
    return String.fromCharCode(65 + index);
  }
}
