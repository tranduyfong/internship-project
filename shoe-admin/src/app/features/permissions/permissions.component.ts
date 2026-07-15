import { Component, OnInit, OnDestroy, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, Subscription, forkJoin } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

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

    // Quản lý trạng thái bảng dữ liệu
    staffList: any[] = [];
    isLoading = true;
    searchTerm: string = '';
    pagination: any = { total: 0, totalPage: 1, currentPage: 1, limit: 10 };

    // Đăng ký bộ lọc Debounce tìm kiếm
    private searchSubject = new Subject<string>();
    private searchSubscription!: Subscription;

    // Quản lý trạng thái Modal Phân Quyền
    isModalOpen = false;
    selectedStaff: any = null;
    isModalLoading = false;

    // Lưu danh mục tất cả quyền hiện có của hệ thống
    systemPermissions: any[] = [];

    // Mảng chứa các ID quyền hạn được Tick chọn tạm thời trên Modal
    selectedPermissionIds: number[] = [];

    ngOnInit(): void {
        // Tải danh mục quyền hệ thống trước, sau đó tải danh sách nhân viên
        this.userService.getAllPermissions().subscribe(res => {
            this.systemPermissions = res.data;
        });

        this.loadStaff();

        // Thiết lập Debounce 0.5 giây cho tìm kiếm nhân viên
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

        const apiPage = this.pagination.currentPage - 1; // Ánh xạ trang UI (1, 2) -> API (0, 1)

        this.userService.getStaff(this.searchTerm, apiPage, 10).subscribe({
            next: (res) => {
                // Để bảng hiển thị mượt mà nhất, với mỗi nhân viên chúng ta tiến hành lấy sẵn quyền của họ
                const staffRaw = res.data;

                if (staffRaw.length === 0) {
                    this.staffList = [];
                    this.pagination.total = res.totalElements;
                    this.pagination.totalPage = res.totalPages;
                    this.isLoading = false;
                    this.cdr.detectChanges();
                    return;
                }

                // Gọi đồng thời API lấy quyền của từng nhân viên để đồng bộ lên bảng danh sách
                const permissionRequests = staffRaw.map((staff: any) =>
                    this.userService.getUserPermissions(staff.id)
                );

                forkJoin(permissionRequests).subscribe({
                    next: (permissionResults: any) => {
                        this.staffList = staffRaw.map((staff: any, index: number) => ({
                            ...staff,
                            permissions: permissionResults[index].data || []
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
                this.cdr.detectChanges();
            }
        });
    }

    onPageChange(page: number) {
        this.pagination.currentPage = page;
        this.loadStaff();
    }

    // Mở Modal phân quyền và tải các quyền hiện tại của nhân viên
    openPermissionsModal(user: any) {
        this.selectedStaff = user;
        this.isModalOpen = true;
        this.isModalLoading = true;
        this.selectedPermissionIds = [];
        this.cdr.detectChanges();

        this.userService.getUserPermissions(user.id).subscribe({
            next: (res) => {
                const userPerms = res.data || [];
                this.selectedPermissionIds = userPerms.map((p: any) => p.id);
                this.isModalLoading = false;
                this.cdr.detectChanges();
            },
            error: () => {
                this.isModalLoading = false;
                this.cdr.detectChanges();
            }
        });
    }

    closePermissionsModal() {
        this.isModalOpen = false;
        this.selectedStaff = null;
    }

    // Hàm xử lý việc Tick/Untick chọn quyền trên Modal
    togglePermission(permissionId: number) {
        const idx = this.selectedPermissionIds.indexOf(permissionId);
        if (idx > -1) {
            this.selectedPermissionIds.splice(idx, 1); // Bỏ chọn
        } else {
            this.selectedPermissionIds.push(permissionId); // Thêm chọn
        }
    }

    isPermissionSelected(permissionId: number): boolean {
        return this.selectedPermissionIds.includes(permissionId);
    }

    // Gửi mảng các ID quyền đã chọn lên API để cập nhật quyền hạn mới
    savePermissions() {
        this.userService.updateUserPermissions(this.selectedStaff.id, this.selectedPermissionIds).subscribe({
            next: () => {
                this.closePermissionsModal();
                this.loadStaff(); // Tải lại bảng ngay sau khi lưu để cập nhật badge hiển thị
            }
        });
    }

    ngOnDestroy(): void {
        if (this.searchSubscription) {
            this.searchSubscription.unsubscribe();
        }
    }
}