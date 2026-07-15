import { Component, Input, Output, OnChanges, EventEmitter, ViewChild, ElementRef, SimpleChanges, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
    selector: 'app-brand-comparison',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './brand-comparison.component.html',
    styleUrls: ['./brand-comparison.component.scss']
})
export class BrandComparisonComponent implements OnChanges, AfterViewInit, OnDestroy {
    @ViewChild('compareChartCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;

    @Input() compareData: any[] = [];
    @Input() isLoading: boolean = false;
    @Input() month1: string = '2026-06';
    @Input() month2: string = '2026-07';

    @Output() monthChange = new EventEmitter<{ month1: string, month2: string }>();

    chartInstance: any;
    private isViewInitialized = false;

    ngAfterViewInit(): void {
        this.isViewInitialized = true;
        this.renderChart();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (this.isViewInitialized && (changes['compareData'] || changes['month1'] || changes['month2'])) {
            setTimeout(() => this.renderChart(), 0);
        }
    }

    onMonthSelectionChange(m1: string, m2: string) {
        this.monthChange.emit({ month1: m1, month2: m2 });
    }

    renderChart() {
        if (this.chartInstance) {
            this.chartInstance.destroy();
            this.chartInstance = null;
        }

        if (!this.isViewInitialized || !this.canvasRef || !this.compareData || this.compareData.length === 0) {
            return;
        }

        const ctx = this.canvasRef.nativeElement.getContext('2d');
        if (!ctx) return;

        // Trích xuất các nhãn thương hiệu từ API
        const labels = this.compareData.map(item => item.brand); // ['Nike', 'Adidas', 'Puma']

        // Khóa động để lấy dữ liệu đúng cấu trúc JSON trả về (Doanh số YYYY-MM)
        const key1 = `Doanh số ${this.month1}`;
        const key2 = `Doanh số ${this.month2}`;

        const dataMonth1 = this.compareData.map(item => item[key1] !== undefined ? item[key1] : 0);
        const dataMonth2 = this.compareData.map(item => item[key2] !== undefined ? item[key2] : 0);

        this.chartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: `Tháng ${this.month1}`,
                        data: dataMonth1,
                        backgroundColor: '#6366F1', // Màu tím Indigo nhã nhặn
                        borderRadius: 6,
                        borderWidth: 0,
                        barPercentage: 0.8,
                        categoryPercentage: 0.6
                    },
                    {
                        label: `Tháng ${this.month2}`,
                        data: dataMonth2,
                        backgroundColor: '#10B981', // Màu xanh lục Emerald hài hòa
                        borderRadius: 6,
                        borderWidth: 0,
                        barPercentage: 0.8,
                        categoryPercentage: 0.6
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            font: { family: 'Quicksand', size: 11, weight: 600 },
                            boxWidth: 12,
                            boxHeight: 12,
                            padding: 15
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { stepSize: 5 }
                    }
                }
            }
        });
    }

    ngOnDestroy(): void {
        if (this.chartInstance) {
            this.chartInstance.destroy();
        }
    }
}