import { Component, OnInit, ViewChild, ElementRef, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyticsService } from '../../core/services/analytics.service';
import { DateUtils } from '../../shared/utils/date.util';
import { SkeletonComponent } from '../../shared/components/skeleton/skeleton.component';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule, SkeletonComponent, PaginationComponent],
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
    @ViewChild('revenueChart') revenueChartRef!: ElementRef;
    private analyticsService = inject(AnalyticsService);
    private cdr = inject(ChangeDetectorRef);

    isLoading: boolean = true;
    isDetailLoading: boolean = false;

    revenueSummary: any = { totalRevenue: '0.00', totalOrders: 0 };
    productReport: any[] = [];
    vipCustomers: any[] = [];
    statusStats: any = { pending: 0, processing: 0, shipped: 0, delivered: 0, cancelled: 0 };

    selectedStatus: string = '';
    detailReceipts: any[] = [];
    pagination: any = { total: 0, totalPage: 1, currentPage: 1, limit: 5 };

    currentTimeRange: 'day' | 'week' | 'month' | 'quarter' | 'year' = 'month';
    chartInstance: any;

    ngOnInit(): void {
        this.loadDashboardData();
    }

    loadDashboardData() {
        this.isLoading = true;
        this.cdr.detectChanges();
        const range = DateUtils.getDateRange(this.currentTimeRange);

        this.analyticsService.getRevenueReport(range.startDate, range.endDate).subscribe({
            next: (res) => {
                this.revenueSummary = res.data.summary;
                this.isLoading = false;
                this.cdr.detectChanges();
                setTimeout(() => this.initChart(res.data.chartData), 0);
            },
            error: () => {
                this.isLoading = false;
                this.cdr.detectChanges();
            }
        });

        this.analyticsService.getProductReport(range.startDate, range.endDate).subscribe({
            next: (res) => {
                this.productReport = res.data;
                this.cdr.detectChanges();
            }
        });

        this.analyticsService.getVipCustomers(range.startDate, range.endDate, 5).subscribe({
            next: (res) => {
                this.vipCustomers = res.data;
                this.cdr.detectChanges();
            }
        });

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
    }

    initChart(chartData: any[]) {
        if (this.chartInstance) {
            this.chartInstance.destroy();
        }

        const labels = chartData.map(item => new Date(item.date).toLocaleDateString('vi-VN'));
        const revenues = chartData.map(item => parseFloat(item.daily_revenue));

        const ctx = this.revenueChartRef.nativeElement.getContext('2d');
        this.chartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Doanh thu hàng ngày (đ)',
                    data: revenues,
                    borderColor: '#4F46E5',
                    backgroundColor: 'rgba(79, 70, 229, 0.05)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.3,
                    pointBackgroundColor: '#4F46E5'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true } }
            }
        });
        this.cdr.detectChanges();
    }

    viewStatusDetail(status: string, page: number = 1) {
        this.selectedStatus = status;
        this.isDetailLoading = true;
        this.cdr.detectChanges();

        this.analyticsService.getReceiptsByStatus(status, page, 5).subscribe({
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

    onDetailPageChange(page: number) {
        this.viewStatusDetail(this.selectedStatus, page);
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