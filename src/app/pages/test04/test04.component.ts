import { Component, ChangeDetectorRef } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { EmployeeProfileService } from '../../services/employee-profile.service';

@Component({
  selector: 'app-test04',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './test04.component.html',
  styleUrl: './test04.component.scss'
})
export class Test04Component {
  formData = {
    firstName: '', lastName: '', email: '', phone: '',
    birthDay: '', profileBase64: '', occupation: '', sex: 'Male'
  };

  occupations = ['Software Engineer', 'Data Scientist', 'Project Manager', 'Designer', 'Other'];
  successMessage = '';
  saveError = '';
  errors: any = {};

  constructor(private profileService: EmployeeProfileService, private cdr: ChangeDetectorRef) {}

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      this.errors.profile = 'รองรับเฉพาะ JPG, PNG, WEBP เท่านั้น';
      event.target.value = '';
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      this.errors.profile = 'ขนาดไฟล์ต้องไม่เกิน 2MB';
      event.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.formData.profileBase64 = e.target.result;
      this.errors.profile = '';
      this.cdr.detectChanges();
    };
    reader.readAsDataURL(file);
  }

  validateForm(): boolean {
    this.errors = {};
    let isValid = true;
    if (!this.formData.firstName) { this.errors.firstName = 'Required'; isValid = false; }
    if (!this.formData.lastName) { this.errors.lastName = 'Required'; isValid = false; }
    if (!this.formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.formData.email)) { this.errors.email = 'Please provide a valid Email'; isValid = false; }
    if (!this.formData.phone || !/^[0-9]{10}$/.test(this.formData.phone)) { this.errors.phone = 'Please provide a valid Phone (10 digits)'; isValid = false; }
    if (!this.formData.birthDay) { this.errors.birthDay = 'Please select Birth Day'; isValid = false; }
    if (!this.formData.profileBase64) { this.errors.profile = 'Please select any profile'; isValid = false; }
    if (!this.formData.occupation) { this.errors.occupation = 'Please select any Occupation'; isValid = false; }
    return isValid;
  }

  save() {
    if (!this.validateForm()) return;

    const apiData = {
      ...this.formData,
      birthDay: `${this.formData.birthDay}T00:00:00`
    };

    this.saveError = '';
    this.profileService.create(apiData as any).subscribe({
      next: (res) => {
        this.successMessage = `บันทึกข้อมูลสำเร็จ Id : ${res.id}`;
        this.clear();
        this.cdr.detectChanges();
        setTimeout(() => { this.successMessage = ''; this.cdr.detectChanges(); }, 3000);
      },
      error: () => {
        this.saveError = 'บันทึกข้อมูลไม่สำเร็จ กรุณาตรวจสอบ Backend';
        this.cdr.detectChanges();
      }
    });
  }

  clear() {
    this.formData = { firstName: '', lastName: '', email: '', phone: '', birthDay: '', profileBase64: '', occupation: '', sex: 'Male' };
    this.errors = {};
    this.saveError = '';
  }
}
