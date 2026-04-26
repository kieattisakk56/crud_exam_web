import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

import { QueueTicketService } from '../../services/queue-ticket.service';

@Component({
  selector: 'app-test05',
  standalone: true,
  imports: [],
  templateUrl: './test05.component.html',
  styleUrl: './test05.component.scss'
})
export class Test05Component implements OnInit {
  viewMode: 'home' | 'ticket' | 'clear' = 'home';
  displayedQueue: string = '00';
  issuedAt: string = '';

  constructor(private queueService: QueueTicketService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.queueService.getCurrent().subscribe({
      next: (res) => { this.displayedQueue = res.ticketNumber; this.cdr.detectChanges(); },
      error: () => { this.displayedQueue = '00'; }
    });
  }

  getTicket() {
    this.queueService.issueTicket().subscribe({
      next: (res) => {
        this.displayedQueue = res.ticketNumber;
        this.issuedAt = res.issuedAt;
        this.viewMode = 'ticket';
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }

  clearQueue() {
    this.queueService.clearQueue().subscribe({
      next: () => {
        this.displayedQueue = '00';
        this.viewMode = 'clear';
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }

  goHome() { this.viewMode = 'home'; }

  getCurrentDateTime(): string {
    const now = new Date();
    return `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()} เวลา ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} น.`;
  }
}
