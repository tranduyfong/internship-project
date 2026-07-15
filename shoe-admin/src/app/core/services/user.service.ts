import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private http = inject(HttpClient);
    private baseUrl = 'http://localhost:8000/api/users';

    // 1. API Tìm kiếm & phân trang người dùng
    searchUsers(keyword: string, pageNumber: number, pageSize: number = 10): Observable<any> {
        return this.http.get(`${this.baseUrl}/search?keyword=${keyword}&pageNumber=${pageNumber}&pageSize=${pageSize}`);
    }

    // 2. API Cập nhật tài khoản Admin
    updateUser(id: number, data: { role?: string; name?: string; phone?: string; }): Observable<any> {
        return this.http.put(`${this.baseUrl}/admin/${id}`, data);
    }

    // 3. API Khóa / Kích hoạt tài khoản
    updateUserStatus(id: number, status: 'LOCKED' | 'ACTIVE'): Observable<any> {
        return this.http.patch(`${this.baseUrl}/admin/${id}/status`, { status });
    }
}