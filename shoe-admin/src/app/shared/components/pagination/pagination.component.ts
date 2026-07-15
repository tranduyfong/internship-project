import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-pagination',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './pagination.component.html',
    styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnChanges {
    @Input() currentPage: number = 1;
    @Input() totalPage: number = 1;
    @Input() totalItems: number = 0;
    @Input() limit: number = 5;

    @Output() pageChange = new EventEmitter<number>();

    pages: (number | string)[] = [];
    protected readonly Math = Math; // Cho phép file HTML truy cập và sử dụng đối tượng Math

    ngOnChanges(): void {
        this.generatePageRange();
    }

    // Thuật toán sinh mảng phân trang chứa dấu ba chấm "..."
    generatePageRange() {
        const current = this.currentPage;
        const total = this.totalPage;
        const pagesArray: (number | string)[] = [];

        if (total <= 5) {
            for (let i = 1; i <= total; i++) {
                pagesArray.push(i);
            }
        } else {
            // Luôn luôn hiển thị trang đầu tiên
            pagesArray.push(1);

            // Nếu trang hiện tại cách xa trang đầu thì thêm dấu "..."
            if (current > 3) {
                pagesArray.push('...');
            }

            // Lấy tối đa 2 nút số gần nhất xung quanh trang hiện tại
            const start = Math.max(2, current - 1);
            const end = Math.min(total - 1, current + 1);

            for (let i = start; i <= end; i++) {
                pagesArray.push(i);
            }

            // Nếu trang hiện tại cách xa trang cuối thì thêm dấu "..."
            if (current < total - 2) {
                pagesArray.push('...');
            }

            // Luôn luôn hiển thị trang cuối cùng
            pagesArray.push(total);
        }

        this.pages = pagesArray;
    }

    goToPage(page: number | string) {
        if (typeof page === 'number' && page >= 1 && page <= this.totalPage && page !== this.currentPage) {
            this.pageChange.emit(page);
        }
    }
}