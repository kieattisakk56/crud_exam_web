import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Person, PersonService } from '../../services/person.service';

@Component({
  selector: 'app-test01',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './test01.component.html',
  styleUrl: './test01.component.scss',
})
export class Test01Component {
  persons: Person[] = [];

  showModal = false;
  isViewMode = false;

  formData: Person = {
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    address: '',
  };

  constructor(
    private personService: PersonService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.loadPersons();
  }

  loadPersons() {
    this.personService.getPersons().subscribe({
      next: (data) => {
        this.persons = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err),
    });
  }

  get ageCalculation(): number | null {
    if (!this.formData.dateOfBirth) return null;
    const birthYear = new Date(this.formData.dateOfBirth).getFullYear();
    const currentYear = new Date().getFullYear();
    return currentYear - birthYear;
  }

  openAddModal() {
    this.isViewMode = false;
    this.formData = { firstName: '', lastName: '', dateOfBirth: '', address: '' };
    this.showModal = true;
  }

  openViewModal(person: Person) {
    this.isViewMode = true;
    this.formData = { ...person };
    // Need to format date to yyyy-MM-dd for input[type="date"]
    if (this.formData.dateOfBirth) {
      this.formData.dateOfBirth = this.formData.dateOfBirth.split('T')[0];
    }
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  save() {
    if (this.isViewMode) return;

    this.personService.addPerson(this.formData).subscribe({
      next: () => {
        this.loadPersons();
        this.closeModal();
      },
      error: (err) => {
        console.error(err);
        alert('Failed to save data. Ensure backend is running.');
      },
    });
  }
}
