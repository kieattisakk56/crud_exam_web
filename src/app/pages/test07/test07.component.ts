import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { ProductQrCodeService, ProductQrCode } from '../../services/product-qrcode.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-test07',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './test07.component.html',
  styleUrl: './test07.component.scss'
})
export class Test07Component implements OnInit {
  productCode: string = '';
  products: ProductQrCode[] = [];
  errorMessage: string = '';
  showDeleteModal: boolean = false;
  productToDelete: number | null = null;
  showQRModal: boolean = false;
  productToShowQR: string = '';
  qrStatus: 'loading' | 'loaded' | 'error' = 'loading';

  constructor(private qrService: ProductQrCodeService, private cdr: ChangeDetectorRef) {}

  ngOnInit() { this.loadData(); }

  loadData() {
    this.qrService.getAll().subscribe({
      next: (data) => { this.products = data; this.cdr.detectChanges(); },
      error: () => { this.errorMessage = 'ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่'; }
    });
  }

  getQRUrl(code: string): string {
    return `${environment.apiUrl}/api/barcode/qrcode?data=${encodeURIComponent(code)}&size=10`;
  }

  onQRLoad() { this.qrStatus = 'loaded'; this.cdr.detectChanges(); }
  onQRError() { this.qrStatus = 'error'; this.cdr.detectChanges(); }

  formatCode(event: any) {
    let input = event.target.value.replace(/[^A-Z0-9]/g, '').toUpperCase();
    if (input.length > 30) input = input.substring(0, 30);
    let formatted = '';
    for (let i = 0; i < input.length; i++) {
      if (i > 0 && i % 5 === 0) formatted += '-';
      formatted += input[i];
    }
    this.productCode = formatted;
  }

  addCode() {
    this.errorMessage = '';
    const cleanCode = this.productCode.replace(/-/g, '');
    if (cleanCode.length !== 30) { this.errorMessage = 'Product code must be exactly 30 characters long.'; return; }
    if (!/^[A-Z0-9]+$/.test(cleanCode)) { this.errorMessage = 'Only uppercase English letters and numbers.'; return; }

    this.qrService.create({ code: this.productCode }).subscribe({
      next: () => { this.productCode = ''; this.loadData(); },
      error: (err) => { this.errorMessage = err.error?.message || 'เพิ่มรหัสสินค้าไม่สำเร็จ'; this.cdr.detectChanges(); }
    });
  }

  openQR(code: string) {
    this.productToShowQR = code;
    this.qrStatus = 'loading';
    this.showQRModal = true;
  }

  closeQR() { this.showQRModal = false; this.productToShowQR = ''; }

  confirmDelete(id: number) { this.productToDelete = id; this.showDeleteModal = true; }

  deleteProduct() {
    if (this.productToDelete !== null) {
      this.qrService.delete(this.productToDelete).subscribe({
        next: () => { this.productToDelete = null; this.showDeleteModal = false; this.loadData(); },
        error: () => { this.showDeleteModal = false; this.errorMessage = 'ลบข้อมูลไม่สำเร็จ กรุณาลองใหม่'; this.cdr.detectChanges(); }
      });
    }
  }

  cancelDelete() { this.productToDelete = null; this.showDeleteModal = false; }
}
