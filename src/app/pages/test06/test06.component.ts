import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { ProductBarcodeService, ProductBarcode } from '../../services/product-barcode.service';

@Component({
  selector: 'app-test06',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './test06.component.html',
  styleUrl: './test06.component.scss'
})
export class Test06Component implements OnInit {
  productCode: string = '';
  products: ProductBarcode[] = [];
  errorMessage: string = '';
  showDeleteModal: boolean = false;
  productToDelete: number | null = null;

  constructor(private barcodeService: ProductBarcodeService, private cdr: ChangeDetectorRef) {}

  ngOnInit() { this.loadData(); }

  loadData() {
    this.barcodeService.getAll().subscribe({
      next: (data) => { this.products = data; this.cdr.detectChanges(); },
      error: () => { this.errorMessage = 'ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่'; }
    });
  }

  formatCode(event: any) {
    let input = event.target.value.replace(/[^A-Z0-9]/g, '').toUpperCase();
    if (input.length > 16) input = input.substring(0, 16);
    let formatted = '';
    for (let i = 0; i < input.length; i++) {
      if (i > 0 && i % 4 === 0) formatted += '-';
      formatted += input[i];
    }
    this.productCode = formatted;
  }

  addCode() {
    this.errorMessage = '';
    const cleanCode = this.productCode.replace(/-/g, '');
    if (cleanCode.length !== 16) { this.errorMessage = 'Product code must be exactly 16 characters long.'; return; }
    if (!/^[A-Z0-9]+$/.test(cleanCode)) { this.errorMessage = 'Product code must contain only uppercase English letters and numbers.'; return; }

    this.barcodeService.create({ code: this.productCode }).subscribe({
      next: () => { this.productCode = ''; this.loadData(); },
      error: (err) => { this.errorMessage = err.error?.message || 'เพิ่มรหัสสินค้าไม่สำเร็จ'; this.cdr.detectChanges(); }
    });
  }

  confirmDelete(id: number) { this.productToDelete = id; this.showDeleteModal = true; }

  deleteProduct() {
    if (this.productToDelete !== null) {
      this.barcodeService.delete(this.productToDelete).subscribe({
        next: () => { this.productToDelete = null; this.showDeleteModal = false; this.loadData(); },
        error: () => { this.showDeleteModal = false; this.errorMessage = 'ลบข้อมูลไม่สำเร็จ กรุณาลองใหม่'; this.cdr.detectChanges(); }
      });
    }
  }

  cancelDelete() { this.productToDelete = null; this.showDeleteModal = false; }
}
