import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-top-products',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './top-products.component.html',
    styleUrls: ['./top-products.component.scss']
})
export class TopProductsComponent {
    @Input() productReport: any[] = [];
    failedImages = new Set<number>();

    handleImageError(productId: number) {
        this.failedImages.add(productId);
    }

    isImageFailed(productId: number): boolean {
        return this.failedImages.has(productId);
    }

    getEmptyRowsArray(currentLength: number): any[] {
        if (currentLength === 0) return [];
        const remaining = 5 - currentLength;
        return remaining > 0 ? Array(remaining) : [];
    }
}