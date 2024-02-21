import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { ModalService } from '../../services/modal.service';
import IClip from '../../models/clip.model';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ClipService } from '../../services/clip.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss'
})
export class EditComponent implements OnInit, OnDestroy, OnChanges{
  @Input() activeClip : IClip | null = null;
  @Output() update = new EventEmitter();

  showAlert = false;
  alertColor = 'blue';
  alertMsg = 'Please wait ! Your clip is being updated.';
  inSubmission = false;

  // title inside the edit form
  title = new UntypedFormControl('', [Validators.required, Validators.minLength(3)]);
  // clip id inside the edit form
  clipID = new UntypedFormControl('');

  // For Edit Form
  editForm = new UntypedFormGroup({
    title: this.title,
    id: this.clipID
  })

  constructor(private modal: ModalService, private clipService : ClipService){}
  
  ngOnInit(): void {
    this.modal.registerModal('editClip');
  }
  
  ngOnChanges(): void {
    if(!this.activeClip) {
      return;
    }

    // Firx to update the banner of alert on edit modals for other edits
    this.inSubmission = false;
    this.showAlert = false;

    this.clipID.setValue(this.activeClip?.docID);
    this.title.setValue(this.activeClip?.title);
  }

  ngOnDestroy(): void {
    this.modal.unRegisterModal('editClip');
  }

  async submit() {
    if(!this.activeClip) {
      return
    }

    // Update alert properties
    this.showAlert = true;
    this.inSubmission = true;
    this.alertColor = 'blue';
    this.alertMsg = 'Please wait ! Your clip is being updated.';

    try {   
      // Send data to firebase
      await this.clipService.updateClip(this.clipID.value, this.title.value);
    } catch (error) {
      this.inSubmission = false;
      this.alertColor = 'red';
      this.alertMsg = 'Something went wrong! Please try again later.'
      return;
    }

    // Send update event along with updated clip onject to parent for refreshing the data
    this.update.emit(this.activeClip);
    
    this.inSubmission = false;
    this.alertColor = 'green'
    this.alertMsg = 'Success! Your clip has been updated.'
  }
}
