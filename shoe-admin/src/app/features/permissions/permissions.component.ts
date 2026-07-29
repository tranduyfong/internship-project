import { Component, OnInit, OnDestroy, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, Subscription, forkJoin } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr'; // 1. Nhúng ToastrService

import { UserService } from '../../core/services/user.service';
import { SkeletonComponent } from '../../shared/components/skeleton/skeleton.component';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { PermissionTableComponent } from './components/permission-table/permission-table.component';

@Component({
    selector: 'app-permissions',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        SkeletonComponent,
        ModalComponent,
        PermissionTableComponent
    ],
    templateUrl: './permissions.component.html',
    styleUrls: ['./permissions.component.scss']
})
export class PermissionsComponent implements OnInit, OnDestroy {
    private userService = inject(UserService);
    private cdr = inject(ChangeDetectorRef);
    private toastr = inject(ToastrService); // 2. Tiêm Toastr vào component

    staffList: any[] = [];
    isLoading = true;
    searchTerm: string = '';
    pagination: any = { total: 0, totalPage: 1, currentPage: 1, limit: 10 };

    private searchSubject = new Subject<string>();
    private searchSubscription!: Subscription;

    isModalOpen = false;
    selectedStaff: any = null;
    isModalLoading = false;

    systemPermissions: any[] = [];

    // 3. NÂNG CẤP: Dùng Set<number> để quản lý ID quyền chính xác tuyệt đối
    selectedPermissionIds = new Set<number>();

    ngOnInit(): void {
        this.userService.getAllPermissions().subscribe({
            next: (res) => {
                this.systemPermissions = res.data || [];
            },
            error: () => {
                this.toastr.error('Không thể tải danh sách quyền hệ thống!', 'Lỗi');
            }
        });

        this.loadStaff();

        this.searchSubscription = this.searchSubject.pipe(
            debounceTime(500),
            distinctUntilChanged()
        ).subscribe(value => {
            this.searchTerm = value;
            this.pagination.currentPage = 1;
            this.loadStaff();
        });
    }

    onSearchInput(event: any) {
        this.searchSubject.next(event.target.value);
    }

    loadStaff() {
        this.isLoading = true;
        this.cdr.detectChanges();

        const apiPage = this.pagination.currentPage - 1;

        this.userService.getStaff(this.searchTerm, apiPage, 10).subscribe({
            next: (res) => {
                const staffRaw = res.data || [];

                if (staffRaw.length === 0) {
                    this.staffList = [];
                    this.pagination.total = res.totalElements || 0;
                    this.pagination.totalPage = res.totalPages || 1;
                    this.isLoading = false;
                    this.cdr.detectChanges();
                    return;
                }

                const permissionRequests = staffRaw.map((staff: any) =>
                    this.userService.getUserPermissions(staff.id)
                );

                forkJoin(permissionRequests).subscribe({
                    next: (permissionResults: any) => {
                        this.staffList = staffRaw.map((staff: any, index: number) => ({
                            ...staff,
                            permissions: permissionResults[index]?.data || []
                        }));

                        this.pagination.total = res.totalElements;
                        this.pagination.totalPage = res.totalPages;
                        this.isLoading = false;
                        this.cdr.detectChanges();
                    },
                    error: () => {
                        this.staffList = staffRaw.map((s: any) => ({ ...s, permissions: [] }));
                        this.isLoading = false;
                        this.cdr.detectChanges();
                    }
                });
            },
            error: () => {
                this.isLoading = false;
                this.toastr.error('Lỗi khi tải danh sách nhân viên!', 'Thất bại');
                this.cdr.detectChanges();
            }
        });
    }

    onPageChange(page: number) {
        this.pagination.currentPage = page;
        this.loadStaff();
    }

    // Mở Modal và nạp quyền hiện tại vào Set
    openPermissionsModal(user: any) {
        this.selectedStaff = user;
        this.isModalOpen = true;
        this.isModalLoading = true;
        this.selectedPermissionIds.clear(); // Xóa sạch bộ nhớ tạm
        this.cdr.detectChanges();

        this.userService.getUserPermissions(user.id).subscribe({
            next: (res) => {
                const userPerms = res.data || [];
                // Ép kiểu chuẩn Number để đảm bảo khớp 100% ID từ Backend
                userPerms.forEach((p: any) => {
                    this.selectedPermissionIds.add(Number(p.id));
                });
                this.isModalLoading = false;
                this.cdr.detectChanges();
            },
            error: () => {
                this.isModalLoading = false;
                this.toastr.error('Không thể tải quyền của nhân viên này!', 'Lỗi');
                this.cdr.detectChanges();
            }
        });
    }

    closePermissionsModal() {
        this.isModalOpen = false;
        this.selectedStaff = null;
        this.selectedPermissionIds.clear();
    }

    togglePermission(permissionId: any) {
        const id = Number(permissionId);
        if (isNaN(id)) return;

        if (this.selectedPermissionIds.has(id)) {
            this.selectedPermissionIds.delete(id); // Nếu đang chọn -> Xóa
        } else {
            this.selectedPermissionIds.add(id);    // Nếu chưa chọn -> Thêm
        }
    }

    isPermissionSelected(permissionId: any): boolean {
        return this.selectedPermissionIds.has(Number(permissionId));
    }

    savePermissions() {
        // Chuyển Set sang mảng số nguyên thuần túy, loại bỏ các giá trị NaN
        const payloadIds = Array.from(this.selectedPermissionIds)
            .map(id => Number(id))
            .filter(id => !isNaN(id));

        console.log('Danh sách ID quyền hạn chuẩn bị gửi lên API:', payloadIds);

        this.userService.updateUserPermissions(this.selectedStaff.id, payloadIds).subscribe({
            next: (res) => {
                const count = payloadIds.length;
                const message = count === 0
                    ? `Đã thu hồi toàn bộ quyền hạn của nhân viên ${this.selectedStaff.name}!`
                    : `Đã cấp ${count} quyền hạn cho nhân viên ${this.selectedStaff.name}!`;

                this.toastr.success(message, 'Thành công');
                this.closePermissionsModal();
                this.loadStaff(); // Tải lại bảng để cập nhật danh sách thẻ quyền mới nhất
            },
            error: (err) => {
                console.error('Lỗi lưu quyền:', err);
                this.toastr.error('Không thể cập nhật quyền hạn. Vui lòng thử lại!', 'Thất bại');
            }
        });
    }

    ngOnDestroy(): void {
        if (this.searchSubscription) {
            this.searchSubscription.unsubscribe();
        }
    }
}