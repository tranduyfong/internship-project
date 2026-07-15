import { Component, Input, Output, EventEmitter, OnChanges, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-profit-report',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './profit-report.component.html',
    styleUrls: ['./profit-report.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfitReportComponent implements OnChanges {
    @Input() profitData: any = null;
    @Input() isLoading: boolean = false;
    @Output() filterChange = new EventEmitter<string>();

    selectedRange: string = 'month';

    constructor(private cdr: ChangeDetectorRef) { }

    ngOnChanges(): void {
        this.cdr.detectChanges();
    }

    onRangeChange(event: any) {
        this.selectedRange = event.target.value;
        this.filterChange.emit(this.selectedRange);
    }
}