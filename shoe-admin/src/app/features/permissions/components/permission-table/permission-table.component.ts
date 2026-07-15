import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';

@Component({
    selector: 'app-permission-table',
    standalone: true,
    imports: [CommonModule, PaginationComponent],
    templateUrl: './permission-table.component.html',
    styleUrls: ['./permission-table.component.scss']
})
export class PermissionTableComponent {
    @Input() staffList: any[] = [];
    @Input() pagination: any = { total: 0, totalPage: 1, currentPage: 1, limit: 10 };
    @Input() isLoading: boolean = false;

    @Output() pageChange = new EventEmitter<number>();
    @Output() managePermissions = new EventEmitter<any>();

    onPageChange(page: number) {
        this.pageChange.emit(page);
    }

    onManage(user: any) {
        this.managePermissions.emit(user);
    }

    // Giữ vững chiều cao bảng cố định là 10 hàng dữ liệu
    getEmptyRowsArray(currentLength: number): any[] {
        if (currentLength === 0) return [];
        const remaining = 10 - currentLength;
        return remaining > 0 ? Array(remaining) : [];
    }
}