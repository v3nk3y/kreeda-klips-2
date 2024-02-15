import { Component, Input, OnInit } from '@angular/core';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class ModalComponent implements OnInit {
  @Input() modalId: string = '';

  constructor(private modalService: ModalService){}

  ngOnInit(): void {
  }

  isModalOpen(id: string): boolean {
    return this.modalService.isModalOpen(id);
  }

  closeModal(id: string): void {
    this.modalService.toggleModal(id);
  }

}
