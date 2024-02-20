import { Component } from '@angular/core';
import { ModalService } from '../services/modal.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss'
})
export class NavComponent {

  constructor(private modalService: ModalService, public auth: AuthService) {}

  openModal($event: Event) {
    $event.preventDefault();
    this.modalService.toggleModal('auth');
  }
}
