import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-summary-cards',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './summary-cards.component.html',
    styleUrls: ['./summary-cards.component.scss']
})
export class SummaryCardsComponent {
    @Input() revenueSummary: any = { totalRevenue: '0.00', totalOrders: 0 };
}