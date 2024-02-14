import { Component, OnInit } from '@angular/core';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class ModalComponent implements OnInit {

  constructor(private modalService: ModalService){

  }

  ngOnInit(): void {
  }

  isModalOpen(): boolean {
    return this.modalService.isModalOpen();
  }

  closeModal(): void {
    this.modalService.toggleModal();
  }

}
