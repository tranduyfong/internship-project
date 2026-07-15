import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-modal',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './modal.component.html',
    styleUrls: ['./modal.component.scss']
})
export class ModalComponent {
    @Input() isOpen: boolean = false;
    @Input() title: string = '';
    @Input() size: 'sm' | 'md' | 'lg' = 'md'; // Linh hoạt kích thước hộp thoại

    @Output() close = new EventEmitter<void>();

    onClose() {
        this.close.emit();
    }
}