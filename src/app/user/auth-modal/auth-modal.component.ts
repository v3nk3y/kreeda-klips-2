import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-auth-modal',
  templateUrl: './auth-modal.component.html',
  styleUrl: './auth-modal.component.scss'
})
export class AuthModalComponent implements OnInit, OnDestroy {
  constructor(private modalService: ModalService){}
  
  ngOnInit(): void {
    this.modalService.registerModal('auth');
  }
  
  ngOnDestroy(): void {
    this.modalService.unRegisterModal('auth');
  }
}
