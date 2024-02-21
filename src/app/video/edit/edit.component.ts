import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { ModalService } from '../../services/modal.service';
import IClip from '../../models/clip.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss'
})
export class EditComponent implements OnInit, OnDestroy, OnChanges{
  @Input() activeClip : IClip | null = null;

  // title inside the edit form
  title = new FormControl('', [Validators.required, Validators.minLength(3)]);
  // clip id inside the edit form
  clipID = new FormControl('');

  // For Edit Form
  editForm = new FormGroup({
    title: this.title,
    id: this.clipID
  })

  constructor(public modal: ModalService){}
  
  ngOnInit(): void {
    this.modal.registerModal('editClip');
  }
  
  ngOnChanges(): void {
    if(!this.activeClip) {
      return;
    }
    this.clipID.setValue(this.activeClip?.docID ?? '');
    this.title.setValue(this.activeClip?.title);
  }

  ngOnDestroy(): void {
    this.modal.unRegisterModal('editClip');
  }
}
