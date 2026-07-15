import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [FormsModule],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent {
    email = '';
    password = '';
    isLoading = false;
    errorMessage = '';

    private http = inject(HttpClient);
    private router = inject(Router);
    private cdr = inject(ChangeDetectorRef);

    onLogin() {
        this.isLoading = true;
        this.errorMessage = '';
        this.cdr.detectChanges();

        this.http.post<any>('http://localhost:8000/api/auth/login', {
            email: this.email,
            password: this.password
        }).subscribe({
            next: (res) => {
                if (res.data.user.role === 'admin') {
                    localStorage.setItem('accessToken', res.data.accessToken);
                    localStorage.setItem('userRole', res.data.user.role);
                    this.router.navigate(['/admin/dashboard']);
                } else {
                    this.errorMessage = 'Bạn không có quyền truy cập!';
                    this.isLoading = false;
                    this.cdr.detectChanges();
                }
            },
            error: () => {
                this.errorMessage = 'Sai email hoặc mật khẩu!';
                this.isLoading = false;
                this.cdr.detectChanges();
            }
        });
    }
}