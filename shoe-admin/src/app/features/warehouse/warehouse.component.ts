import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyticsService } from '../../core/services/analytics.service';
import { DateUtils } from '../../shared/utils/date.util';

// Nhập các component con vừa tạo
import { OverviewStatsComponent } from './components/overview-stats/overview-stats.component';
import { ProfitReportComponent } from './components/profit-report/profit-report.component';
import { BrandComparisonComponent } from './components/brand-comparison/brand-comparison.component';

@Component({
    selector: 'app-warehouse',
    standalone: true,
    imports: [
        CommonModule,
        OverviewStatsComponent,
        ProfitReportComponent,
        BrandComparisonComponent
    ],
    templateUrl: './warehouse.component.html',
    styleUrls: ['./warehouse.component.scss']
})
export class WarehouseComponent implements OnInit {
    private analyticsService = inject(AnalyticsService);
    private cdr = inject(ChangeDetectorRef);

    // Trạng thái Loading của từng phần
    isOverviewLoading = true;
    isProfitLoading = true;
    isCompareLoading = true;

    // Lưu trữ dữ liệu từ API
    overviewData: any = null;
    profitData: any = null;
    compareData: any[] = [];

    // Mặc định khoảng ngày lợi nhuận
    profitTimeRange: string = 'month';

    // Mặc định thời gian so sánh tháng trước và tháng này của năm 2026
    month1: string = '2026-06';
    month2: string = '2026-07';

    ngOnInit(): void {
        this.loadOverviewStats();
        this.loadProfitReport();
        this.loadBrandComparison();
    }

    // 1. Lấy dữ liệu Tổng quan kho hàng (Overview - Không theo thời gian)
    loadOverviewStats() {
        this.isOverviewLoading = true;
        this.cdr.detectChanges();

        this.analyticsService.getOverviewStats().subscribe({
            next: (res) => {
                this.overviewData = res.data;
                this.isOverviewLoading = false;
                this.cdr.detectChanges(); // Ép render lập tức
            },
            error: () => {
                this.isOverviewLoading = false;
                this.cdr.detectChanges();
            }
        });
    }

    // 2. Lấy báo cáo Lợi nhuận gộp (Tái sử dụng trực tiếp DateUtils của bạn)
    loadProfitReport() {
        this.isProfitLoading = true;
        this.cdr.detectChanges();

        const range = DateUtils.getDateRange(this.profitTimeRange as any);

        this.analyticsService.getProfitReport(range.startDate, range.endDate).subscribe({
            next: (res) => {
                this.profitData = res.data;
                this.isProfitLoading = false;
                this.cdr.detectChanges();
            },
            error: () => {
                this.isProfitLoading = false;
                this.cdr.detectChanges();
            }
        });
    }

    handleProfitFilterChange(range: string) {
        this.profitTimeRange = range;
        this.loadProfitReport();
    }

    // 3. Lấy dữ liệu biểu đồ cột đôi So sánh hãng giữa 2 tháng
    loadBrandComparison() {
        this.isCompareLoading = true;
        this.cdr.detectChanges();

        this.analyticsService.compareBrands(this.month1, this.month2).subscribe({
            next: (res) => {
                this.compareData = res.data;
                this.isCompareLoading = false;
                this.cdr.detectChanges();
            },
            error: () => {
                this.isCompareLoading = false;
                this.cdr.detectChanges();
            }
        });
    }

    handleMonthSelectionChange(event: { month1: string, month2: string }) {
        this.month1 = event.month1;
        this.month2 = event.month2;
        this.loadBrandComparison();
    }
}