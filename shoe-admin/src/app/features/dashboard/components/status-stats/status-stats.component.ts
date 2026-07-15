import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-status-stats',
    standalone: true,
    templateUrl: './status-stats.component.html',
    styleUrls: ['./status-stats.component.scss']
})
export class StatusStatsComponent {
    @Input() statusStats: any = { pending: 0, processing: 0, shipped: 0, delivered: 0, cancelled: 0 };
    @Output() selectStatus = new EventEmitter<string>();

    onSelect(status: string) {
        this.selectStatus.emit(status);
    }
}