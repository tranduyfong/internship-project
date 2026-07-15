import { Component, Input, ChangeDetectionStrategy, ChangeDetectorRef, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-overview-stats',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './overview-stats.component.html',
    styleUrls: ['./overview-stats.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush // Tối ưu hóa hiệu năng render
})
export class OverviewStatsComponent implements OnChanges {
    @Input() overviewData: any = null;
    @Input() isLoading: boolean = false;

    constructor(private cdr: ChangeDetectorRef) { }

    ngOnChanges(): void {
        this.cdr.detectChanges(); // Ép cập nhật giao diện ngay lập tức khi dữ liệu truyền vào thay đổi
    }

    // Hàm tính toán phần trăm để vẽ thanh progress bar
    getPercentage(itemValue: string | number, totalValue: string | number): number {
        const item = typeof itemValue === 'string' ? parseFloat(itemValue) : itemValue;
        const total = typeof totalValue === 'string' ? parseFloat(totalValue) : totalValue;
        if (!total || total === 0) return 0;
        return Math.round((item / total) * 100);
    }
}