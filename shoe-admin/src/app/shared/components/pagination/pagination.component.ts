import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-pagination',
    standalone: true,
    templateUrl: './pagination.component.html',
    styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent {
    @Input() currentPage: number = 1;
    @Input() totalPage: number = 1;
    @Input() totalItems: number = 0;
    @Input() limit: number = 5;

    @Output() pageChange = new EventEmitter<number>();

    goToPage(page: number) {
        if (page >= 1 && page <= this.totalPage && page !== this.currentPage) {
            this.pageChange.emit(page);
        }
    }
}