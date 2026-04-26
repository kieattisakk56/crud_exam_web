import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { ExamQuestionService, ExamQuestion } from '../../services/exam-question.service';

@Component({
  selector: 'app-test08',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './test08.component.html',
  styleUrl: './test08.component.scss'
})
export class Test08Component implements OnInit {
  viewMode: 'list' | 'add' = 'list';
  questions: ExamQuestion[] = [];

  newQuestion = {
    questionText: '',
    choices: ['', ''],
    correctAnswer: 1
  };

  constructor(private examService: ExamQuestionService, private cdr: ChangeDetectorRef) {}

  ngOnInit() { this.loadData(); }

  loadData() {
    this.examService.getAll().subscribe({
      next: (data) => { this.questions = data; this.cdr.detectChanges(); },
      error: (err) => console.error(err)
    });
  }

  showAddForm() {
    this.newQuestion = { questionText: '', choices: ['', ''], correctAnswer: 1 };
    this.viewMode = 'add';
  }

  cancelAdd() { this.viewMode = 'list'; }

  addChoice() {
    this.newQuestion.choices.push('');
  }

  removeChoice(index: number) {
    if (this.newQuestion.choices.length <= 2) return;
    this.newQuestion.choices.splice(index, 1);
    if (this.newQuestion.correctAnswer > this.newQuestion.choices.length) {
      this.newQuestion.correctAnswer = this.newQuestion.choices.length;
    }
  }

  saveQuestion() {
    if (!this.newQuestion.questionText.trim()) { alert('กรุณากรอกคำถาม'); return; }
    if (this.newQuestion.choices.some(c => !c.trim())) { alert('กรุณากรอกตัวเลือกให้ครบทุกข้อ'); return; }
    if (this.newQuestion.choices.length < 2) { alert('ต้องมีตัวเลือกอย่างน้อย 2 ข้อ'); return; }

    this.examService.create({
      questionText: this.newQuestion.questionText,
      choices: this.newQuestion.choices,
      correctAnswer: this.newQuestion.correctAnswer
    }).subscribe({
      next: () => { this.viewMode = 'list'; this.loadData(); },
      error: (err) => { alert(err.error?.message || 'บันทึกไม่สำเร็จ'); }
    });
  }

  deleteQuestion(id: number) {
    this.examService.delete(id).subscribe({
      next: () => this.loadData(),
      error: (err) => console.error(err)
    });
  }

  choiceLabel(index: number): string {
    return String.fromCharCode(65 + index); // A, B, C, D...
  }
}
