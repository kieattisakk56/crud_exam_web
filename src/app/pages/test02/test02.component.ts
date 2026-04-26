import { Component, ChangeDetectorRef } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-test02',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './test02.component.html',
  styleUrl: './test02.component.scss'
})
export class Test02Component {
  viewMode: 'login' | 'register' | 'welcome' = 'login';

  username = '';
  password = '';
  confirmPassword = '';

  welcomeUser = '';
  errorMessage = '';

  constructor(private authService: AuthService, private cdr: ChangeDetectorRef) {
    if (this.authService.isLoggedIn()) {
      this.welcomeUser = localStorage.getItem('username') || 'User';
      this.viewMode = 'welcome';
    }
  }

  showRegister() {
    this.viewMode = 'register';
    this.errorMessage = '';
    this.password = '';
    this.confirmPassword = '';
  }

  showLogin() {
    this.viewMode = 'login';
    this.errorMessage = '';
    this.password = '';
  }

  login() {
    if (!this.username || !this.password) {
      this.errorMessage = 'Please enter username and password.';
      return;
    }

    this.authService.login({ username: this.username, password: this.password }).subscribe({
      next: (res) => {
        this.welcomeUser = res.username;
        this.viewMode = 'welcome';
        this.errorMessage = '';
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage = err.error?.message || err.error || 'Invalid username or password.';
        this.cdr.detectChanges();
      }
    });
  }

  register() {
    if (!this.username || !this.password || !this.confirmPassword) {
      this.errorMessage = 'Please fill all fields.';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    this.authService.register({ username: this.username, password: this.password, confirmPassword: this.confirmPassword }).subscribe({
      next: () => {
        alert('Registration successful! Please login.');
        this.showLogin();
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage = err.error?.message || err.error || 'Registration failed.';
        this.cdr.detectChanges();
      }
    });
  }

  logout() {
    this.authService.logout();
    this.showLogin();
  }
}
