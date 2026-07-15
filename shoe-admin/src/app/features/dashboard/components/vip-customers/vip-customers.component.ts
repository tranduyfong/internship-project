import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-vip-customers',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './vip-customers.component.html',
    styleUrls: ['./vip-customers.component.scss']
})
export class VipCustomersComponent {
    @Input() vipCustomers: any[] = [];

    getEmptyRowsArray(currentLength: number): any[] {
        if (currentLength === 0) return [];
        const remaining = 5 - currentLength;
        return remaining > 0 ? Array(remaining) : [];
    }
}