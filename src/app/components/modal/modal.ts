import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-modal',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './modal.html',
    styleUrls: ['./modal.scss'],
})
export class ModalComponent {
    @Input() isOpen: boolean = false;
    @Input() title: string = '';
    @Output() closeModal = new EventEmitter<void>();

    onClose() {
        this.closeModal.emit();
    }
}
