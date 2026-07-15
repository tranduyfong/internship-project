import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginationComponent } from '../pagination/pagination.component';

@Component({
    selector: 'app-account-table',
    standalone: true,
    imports: [CommonModule, PaginationComponent],
    templateUrl: './account-table.component.html',
    styleUrls: ['./account-table.component.scss']
})
export class AccountTableComponent {
    @Input() users: any[] = [];
    @Input() pagination: any = { total: 0, totalPage: 1, currentPage: 1, limit: 10 };
    @Input() isLoading: boolean = false;

    @Output() pageChange = new EventEmitter<number>();
    @Output() editUser = new EventEmitter<any>();
    @Output() lockUser = new EventEmitter<any>();

    onPageChange(page: number) {
        this.pageChange.emit(page);
    }

    onEdit(user: any) {
        this.editUser.emit(user);
    }

    onLockToggle(user: any) {
        this.lockUser.emit(user);
    }

    // Bù đắp dòng trống để bảo đảm chiều cao bảng luôn đạt chuẩn cố định (10 hàng dữ liệu)
    getEmptyRowsArray(currentLength: number): any[] {
        if (currentLength === 0) return [];
        const remaining = 10 - currentLength;
        return remaining > 0 ? Array(remaining) : [];
    }
}