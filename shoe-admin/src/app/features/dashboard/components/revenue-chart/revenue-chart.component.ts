import { Component, Input, OnChanges, ViewChild, ElementRef, SimpleChanges, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common'; // Nhập CommonModule để xử lý kiểm tra rỗng trong HTML

import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
    selector: 'app-revenue-chart',
    standalone: true,
    imports: [CommonModule], // Thêm vào đây
    templateUrl: './revenue-chart.component.html',
    styleUrls: ['./revenue-chart.component.scss']
})
export class RevenueChartComponent implements OnChanges, AfterViewInit, OnDestroy {
    @ViewChild('chartCanvas') chartCanvasRef!: ElementRef<HTMLCanvasElement>;
    @Input() chartData: any[] = [];

    chartInstance: any;
    private isViewInitialized = false;

    ngAfterViewInit(): void {
        this.isViewInitialized = true;
        this.renderChart();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (this.isViewInitialized && changes['chartData']) {
            setTimeout(() => this.renderChart(), 0);
        }
    }

    renderChart() {
        // Luôn luôn dọn dẹp biểu đồ cũ khi có sự thay đổi khoảng ngày để giải phóng bộ nhớ
        if (this.chartInstance) {
            this.chartInstance.destroy();
            this.chartInstance = null;
        }

        // Nếu HTML chưa sẵn sàng hoặc mảng dữ liệu rỗng, dừng lại để HTML hiển thị giao diện trống
        if (!this.isViewInitialized || !this.chartCanvasRef || !this.chartData || this.chartData.length === 0) {
            return;
        }

        const ctx = this.chartCanvasRef.nativeElement.getContext('2d');
        if (!ctx) return;

        const labels = this.chartData.map(item => new Date(item.date).toLocaleDateString('vi-VN'));
        const revenues = this.chartData.map(item => parseFloat(item.daily_revenue));

        this.chartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Doanh thu (đ)',
                    data: revenues,
                    borderColor: '#4F46E5',
                    backgroundColor: 'rgba(79, 70, 229, 0.05)',
                    borderWidth: 2.5,
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
    }

    ngOnDestroy(): void {
        if (this.chartInstance) {
            this.chartInstance.destroy();
        }
    }
}