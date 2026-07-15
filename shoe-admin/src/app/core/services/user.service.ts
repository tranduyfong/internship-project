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
        const url = `${this.baseUrl}/search?keyword=${keyword}&pageNumber=${pageNumber}&pageSize=${pageSize}`;
        return this.http.get(url);
    }

    // 2. API Cập nhật thông tin tài khoản (PUT)
    updateUser(id: number, data: { role?: string; name?: string; phone?: string; }): Observable<any> {
        // Kiểm tra phòng thủ nếu ID bị truyền sai hoặc undefined
        if (!id) {
            console.error('%c[LỖI NGHIÊM TRỌNG]: ID người dùng bị undefined hoặc rỗng!', 'color: red; font-weight: bold;', { id, data });
        }

        const url = `${this.baseUrl}/admin/${id}`;
        return this.http.put(url, data);
    }

    // 3. API Khóa / Mở khóa tài khoản (PATCH)
    updateUserStatus(id: number, status: 'LOCKED' | 'ACTIVE'): Observable<any> {
        if (!id) {
            console.error('%c[LỖI NGHIÊM TRỌNG]: ID người dùng bị undefined khi cập nhật trạng thái!', 'color: red; font-weight: bold;', { id, status });
        }

        const url = `${this.baseUrl}/admin/${id}/status`;
        return this.http.patch(url, { status });
    }

    // 4. API Lấy danh sách nhân viên
    getStaff(keyword: string, pageNumber: number, pageSize: number = 10): Observable<any> {
        const url = `${this.baseUrl}/search?role=staff&keyword=${keyword}&pageNumber=${pageNumber}&pageSize=${pageSize}`;
        return this.http.get(url);
    }

    // 5. API Lấy tất cả quyền hạn
    getAllPermissions(): Observable<any> {
        const url = `${this.baseUrl}/admin/permissions`;
        return this.http.get(url);
    }

    // 6. API Lấy chi tiết quyền của nhân viên
    getUserPermissions(userId: number): Observable<any> {
        if (!userId) {
            console.error('getUserPermissions Error: userId is missing!');
        }
        const url = `${this.baseUrl}/admin/${userId}/permissions`;
        return this.http.get(url);
    }

    // 7. API Cập nhật danh sách quyền hạn cho nhân viên (PATCH)
    updateUserPermissions(userId: number, permissionIds: number[]): Observable<any> {
        if (!userId) {
            console.error('%c[LỖI NGHIÊM TRỌNG]: userId bị undefined khi cập nhật quyền hạn!', 'color: red; font-weight: bold;', { userId, permissionIds });
        }

        const url = `${this.baseUrl}/admin/${userId}/permissions`;
        return this.http.put(url, { permissionIds });
    }
}