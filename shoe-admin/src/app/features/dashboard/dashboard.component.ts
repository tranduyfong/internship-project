import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyticsService } from '../../core/services/analytics.service';
import { DateUtils } from '../../shared/utils/date.util';
import { SkeletonComponent } from '../../shared/components/skeleton/skeleton.component';

// Nhập các thành phần con vừa được chia nhỏ
import { SummaryCardsComponent } from './components/summary-cards/summary-cards.component';
import { RevenueChartComponent } from './components/revenue-chart/revenue-chart.component';
import { StatusStatsComponent } from './components/status-stats/status-stats.component';
import { StatusDetailTableComponent } from './components/status-detail-table/status-detail-table.component';
import { TopProductsComponent } from './components/top-products/top-products.component';
import { VipCustomersComponent } from './components/vip-customers/vip-customers.component';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [
        CommonModule,
        SkeletonComponent,
        SummaryCardsComponent,
        RevenueChartComponent,
        StatusStatsComponent,
        StatusDetailTableComponent,
        TopProductsComponent,
        VipCustomersComponent
    ],
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
    private analyticsService = inject(AnalyticsService);
    private cdr = inject(ChangeDetectorRef);

    // Trạng thái Loading và Lưu trữ dữ liệu
    isLoading: boolean = true;
    isDetailLoading: boolean = false;

    revenueSummary: any = { totalRevenue: '0.00', totalOrders: 0 };
    chartData: any[] = [];
    productReport: any[] = [];
    vipCustomers: any[] = [];
    statusStats: any = { pending: 0, processing: 0, shipped: 0, delivered: 0, cancelled: 0 };

    selectedStatus: string = '';
    detailReceipts: any[] = [];
    pagination: any = { total: 0, totalPage: 1, currentPage: 1, limit: 5 };

    currentTimeRange: 'day' | 'week' | 'month' | 'quarter' | 'year' = 'month';

    ngOnInit(): void {
        this.loadDashboardData();
    }

    loadDashboardData() {
        this.isLoading = true;
        this.cdr.detectChanges();
        const range = DateUtils.getDateRange(this.currentTimeRange);

        // 1. Gọi API Lấy doanh thu & dữ liệu biểu đồ
        this.analyticsService.getRevenueReport(range.startDate, range.endDate).subscribe({
            next: (res) => {
                this.revenueSummary = res.data.summary;
                this.chartData = res.data.chartData;
                this.isLoading = false;
                this.cdr.detectChanges();
            },
            error: () => {
                this.isLoading = false;
                this.cdr.detectChanges();
            }
        });

        // 2. Gọi API Báo cáo sản phẩm bán chạy
        this.analyticsService.getProductReport(range.startDate, range.endDate).subscribe({
            next: (res) => {
                this.productReport = res.data;
                this.cdr.detectChanges();
            }
        });

        // 3. Gọi API Báo cáo Khách hàng VIP
        this.analyticsService.getVipCustomers(range.startDate, range.endDate, 5).subscribe({
            next: (res) => {
                this.vipCustomers = res.data;
                this.cdr.detectChanges();
            }
        });

        // 4. Gọi API Thống kê số lượng các tiến trình
        this.analyticsService.getOrderStatusStats(range.startDate, range.endDate).subscribe({
            next: (res) => {
                this.statusStats = res.data;
                this.cdr.detectChanges();
            }
        });
    }

    onRangeChange(event: any) {
        this.currentTimeRange = event.target.value;
        this.loadDashboardData();

        if (this.selectedStatus) {
            this.handleStatusSelect(this.selectedStatus, 1);
        }
    }

    // 5. Gọi API lấy chi tiết đơn hàng cho bảng tiến trình
    handleStatusSelect(status: string, page: number = 1) {
        this.selectedStatus = status;
        this.isDetailLoading = true;
        this.cdr.detectChanges();

        const range = DateUtils.getDateRange(this.currentTimeRange);

        this.analyticsService.getReceiptsByStatus(status, range.startDate, range.endDate, page, 5).subscribe({
            next: (res) => {
                this.detailReceipts = res.data.receipts;
                this.pagination = res.data.pagination;
                this.isDetailLoading = false;
                this.cdr.detectChanges();
            },
            error: () => {
                this.isDetailLoading = false;
                this.cdr.detectChanges();
            }
        });
    }

    handleDetailPageChange(page: number) {
        this.handleStatusSelect(this.selectedStatus, page);
    }

    handleCloseTable() {
        this.selectedStatus = '';
    }
}