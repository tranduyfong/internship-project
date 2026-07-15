import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-form-input',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './form-input.component.html',
    styleUrls: ['./form-input.component.scss']
})
export class FormInputComponent {
    @Input() label: string = '';
    @Input() id: string = '';
    @Input() type: string = 'text';
    @Input() placeholder: string = '';
    @Input() value: string = '';
    @Input() required: boolean = false;
    @Input() disabled: boolean = false;
    @Input() errorMessage: string = ''; // Hiện thông báo lỗi nếu có

    @Output() valueChange = new EventEmitter<string>();

    onModelChange(newValue: string) {
        this.value = newValue;
        this.valueChange.emit(newValue);
    }
}