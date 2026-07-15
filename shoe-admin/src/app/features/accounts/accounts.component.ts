import { Component, OnInit, OnDestroy, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { UserService } from '../../core/services/user.service';
import { SkeletonComponent } from '../../shared/components/skeleton/skeleton.component';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { FormInputComponent } from '../../shared/components/form-input/form-input.component';
import { AccountTableComponent } from '../../shared/components/account-table/account-table.component';

@Component({
    selector: 'app-accounts',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        SkeletonComponent,
        ModalComponent,
        FormInputComponent,
        AccountTableComponent
    ],
    templateUrl: './accounts.component.html',
    styleUrls: ['./accounts.component.scss']
})
export class AccountsComponent implements OnInit, OnDestroy {
    private userService = inject(UserService);
    private cdr = inject(ChangeDetectorRef);

    // Trạng thái chung
    users: any[] = [];
    isLoading = true;
    searchTerm: string = '';
    pagination: any = { total: 0, totalPage: 1, currentPage: 1, limit: 10 };

    // Khai báo công cụ Debounce tìm kiếm
    private searchSubject = new Subject<string>();
    private searchSubscription!: Subscription;

    // Trạng thái các Modal
    isEditModalOpen = false;
    isLockModalOpen = false;

    // Dữ liệu tạm của tài khoản đang được chọn
    selectedUser: any = null;
    editForm: any = { name: '', role: '', phone: '' };
    editFormErrors: any = { name: '', phone: '' }; // Lưu vết các lỗi bắt buộc điền

    ngOnInit(): void {
        this.loadUsers();

        // CẤU HÌNH DEBOUNCE: Đợi đúng 500ms (0.5 giây) sau khi dừng gõ mới kích hoạt tìm kiếm
        this.searchSubscription = this.searchSubject.pipe(
            debounceTime(500),
            distinctUntilChanged()
        ).subscribe(value => {
            this.searchTerm = value;
            this.pagination.currentPage = 1; // Đưa về trang 1 khi tìm kiếm mới
            this.loadUsers();
        });
    }

    // Gửi tín hiệu gõ phím từ HTML vào bộ lọc Debounce
    onSearchInput(event: any) {
        this.searchSubject.next(event.target.value);
    }

    loadUsers() {
        this.isLoading = true;
        this.cdr.detectChanges();

        // Quy đổi: Trang UI (1, 2) -> Trang API (0, 1) để khớp 100% với backend của bạn
        const apiPage = this.pagination.currentPage - 1;

        this.userService.searchUsers(this.searchTerm, apiPage, 10).subscribe({
            next: (res) => {
                // Fallback: Gán status nếu API chưa trả về để UI hiển thị chuẩn chỉ
                this.users = res.data.map((u: any) => ({
                    ...u,
                    status: u.status || 'ACTIVE'
                }));

                this.pagination.total = res.totalElements;
                this.pagination.totalPage = res.totalPages;
                this.isLoading = false;
                this.cdr.detectChanges();
            },
            error: () => {
                this.isLoading = false;
                this.cdr.detectChanges();
            }
        });
    }

    onPageChange(page: number) {
        this.pagination.currentPage = page;
        this.loadUsers();
    }

    // Mở hộp thoại Sửa tài khoản
    openEditModal(user: any) {
        this.selectedUser = user;
        this.editForm = {
            name: user.name,
            role: user.role,
            phone: user.phone || ''
        };
        this.editFormErrors = { name: '', phone: '' }; // Reset thông báo lỗi
        this.isEditModalOpen = true;
        this.cdr.detectChanges();
    }

    closeEditModal() {
        this.isEditModalOpen = false;
        this.selectedUser = null;
    }

    // Thực thi cập nhật tài khoản
    submitEditForm() {
        let hasError = false;

        // VALIDATION BẮT BUỘC ĐIỀN (Sử dụng trực tiếp Input Component lỗi)
        if (!this.editForm.name.trim()) {
            this.editFormErrors.name = 'Họ và tên không được để trống!';
            hasError = true;
        } else {
            this.editFormErrors.name = '';
        }

        if (!this.editForm.phone.trim()) {
            this.editFormErrors.phone = 'Số điện thoại là bắt buộc!';
            hasError = true;
        } else {
            this.editFormErrors.phone = '';
        }

        if (hasError) {
            this.cdr.detectChanges();
            return;
        }

        this.userService.updateUser(this.selectedUser.id, this.editForm).subscribe({
            next: () => {
                this.closeEditModal();
                this.loadUsers(); // Tải lại bảng ngay sau khi sửa thành công
            }
        });
    }

    // Mở hộp thoại Khóa / Mở khóa tài khoản
    openLockModal(user: any) {
        this.selectedUser = user;
        this.isLockModalOpen = true;
        this.cdr.detectChanges();
    }

    closeLockModal() {
        this.isLockModalOpen = false;
        this.selectedUser = null;
    }

    // Thực thi đảo trạng thái Khóa / Kích hoạt tài khoản
    confirmLockToggle() {
        const nextStatus = this.selectedUser.status === 'LOCKED' ? 'ACTIVE' : 'LOCKED';

        this.userService.updateUserStatus(this.selectedUser.id, nextStatus).subscribe({
            next: () => {
                this.closeLockModal();
                this.loadUsers(); // Tải lại bảng sau khi thay đổi trạng thái thành công
            }
        });
    }

    ngOnDestroy(): void {
        if (this.searchSubscription) {
            this.searchSubscription.unsubscribe(); // Dọn dẹp rò rỉ bộ nhớ khi chuyển trang
        }
    }
}