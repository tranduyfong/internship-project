import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';

@Component({
    selector: 'app-status-detail-table',
    standalone: true,
    imports: [CommonModule, PaginationComponent],
    templateUrl: './status-detail-table.component.html',
    styleUrls: ['./status-detail-table.component.scss']
})
export class StatusDetailTableComponent {
    @Input() selectedStatus: string = '';
    @Input() detailReceipts: any[] = [];
    @Input() pagination: any = { total: 0, totalPage: 1, currentPage: 1, limit: 5 };
    @Input() isDetailLoading: boolean = false;

    @Output() pageChange = new EventEmitter<number>();
    @Output() closeTable = new EventEmitter<void>();

    onPageChange(page: number) {
        this.pageChange.emit(page);
    }

    onClose() {
        this.closeTable.emit();
    }

    getEmptyRowsArray(currentLength: number): any[] {
        if (currentLength === 0) return [];
        const remaining = 5 - currentLength;
        return remaining > 0 ? Array(remaining) : [];
    }

    getStatusColorClass(status: string): string {
        switch (status.toLowerCase()) {
            case 'pending': return 'bg-amber-50 text-amber-600 border border-amber-200';
            case 'processing': return 'bg-blue-50 text-blue-600 border border-blue-200';
            case 'shipped': return 'bg-indigo-50 text-indigo-600 border border-indigo-200';
            case 'delivered': return 'bg-green-50 text-green-600 border border-green-200';
            case 'cancelled': return 'bg-red-50 text-red-600 border border-red-200';
            default: return 'bg-gray-50 text-gray-600 border border-gray-200';
        }
    }

    getVietnameseStatus(status: string): string {
        switch (status.toLowerCase()) {
            case 'pending': return 'Chờ thanh toán';
            case 'processing': return 'Đang xử lý';
            case 'shipped': return 'Đang giao hàng';
            case 'delivered': return 'Đã giao hàng';
            case 'cancelled': return 'Đã hủy';
            default: return status;
        }
    }
}