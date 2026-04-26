import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { ApprovalService, ApprovalDocument } from '../../services/approval.service';

@Component({
  selector: 'app-test03',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './test03.component.html',
  styleUrl: './test03.component.scss'
})
export class Test03Component implements OnInit {
  documents: ApprovalDocument[] = [];
  selectedDocuments: Set<number> = new Set();
  showApproveModal = false;
  showRejectModal = false;
  currentReason = '';

  constructor(private approvalService: ApprovalService, private cdr: ChangeDetectorRef) {}

  ngOnInit() { this.loadData(); }

  loadData() {
    this.approvalService.getAll().subscribe({
      next: (data) => { this.documents = data; this.cdr.detectChanges(); },
      error: (err) => console.error('API Error:', err)
    });
  }

  toggleSelection(doc: ApprovalDocument) {
    if (doc.status !== 0) return;
    if (this.selectedDocuments.has(doc.id!)) {
      this.selectedDocuments.delete(doc.id!);
    } else {
      this.selectedDocuments.add(doc.id!);
    }
  }

  isAllSelected(): boolean {
    const pendingDocs = this.documents.filter(d => d.status === 0);
    return pendingDocs.length > 0 && this.selectedDocuments.size === pendingDocs.length;
  }

  toggleAll() {
    const pendingDocs = this.documents.filter(d => d.status === 0);
    if (this.isAllSelected()) {
      this.selectedDocuments.clear();
    } else {
      pendingDocs.forEach(d => this.selectedDocuments.add(d.id!));
    }
  }

  openApproveModal() {
    if (this.selectedDocuments.size === 0) return;
    this.currentReason = '';
    this.showApproveModal = true;
  }

  openRejectModal() {
    if (this.selectedDocuments.size === 0) return;
    this.currentReason = '';
    this.showRejectModal = true;
  }

  confirmApprove() {
    this.approvalService.approve(Array.from(this.selectedDocuments), this.currentReason).subscribe({
      next: () => { this.closeModals(); this.loadData(); },
      error: (err) => console.error(err)
    });
  }

  confirmReject() {
    this.approvalService.reject(Array.from(this.selectedDocuments), this.currentReason).subscribe({
      next: () => { this.closeModals(); this.loadData(); },
      error: (err) => console.error(err)
    });
  }

  closeModals() {
    this.showApproveModal = false;
    this.showRejectModal = false;
    this.selectedDocuments.clear();
  }
}
