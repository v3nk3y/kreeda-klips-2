import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/compat/storage';

import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { v4 as uuid } from 'uuid';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent {
  isDragover = false; // just a toggle to identify and change color for dropbox
  file: File | null = null;
  // For toggle between file drop and upload form steps
  nextStep = false;

  showAlert = false;
  alertColor = 'blue';
  alertMsg = 'Please wait ! Your clip is being uploaded.';
  inSubmission = false;

  // uploadPercentage
  percentage = 0;

  // FormControl for Video title capture
  title = new FormControl('', [
    Validators.required,
    Validators.minLength(3),
  ]);

  // FormgGroup
  uploadForm = new FormGroup({
    title: this.title
  })

  // title = new UntypedFormControl('', [
  //   Validators.required,
  //   Validators.minLength(3)
  // ])
  // uploadForm = new UntypedFormGroup({
  //   title: this.title
  // })

  constructor(
    private storage: AngularFireStorage,
    private auth: AngularFireAuth,
    private router: Router,
  ) { 
  }


  storeFile($event: Event) {
    this.isDragover = false
    // let the TS know the event is of type DragEvent for Intellisense
    this.file = ($event as DragEvent).dataTransfer?.files.item(0) ?? null;

    // If the file type is not video, then exit
    if(!this.file || this.file.type !== 'video/mp4'){
      return;
    }

    // Set the title of video to file name without extension
    this.title.setValue(
      this.file.name.replace(/\.[^/.]+$/, '')
    );

    // this.file = ($event as DragEvent).dataTransfer ?
    //   ($event as DragEvent).dataTransfer?.files.item(0) ?? null :
    //   ($event.target as HTMLInputElement).files?.item(0) ?? null


    // this.title.setValue(
    //   // Replace File extension with empty string
    //   this.file.name.replace(/\.[^/.]+$/, '')
    // )
    this.nextStep = true
  }

  uploadFile() {
    this.showAlert = true;
    this.alertColor = 'blue';
    this.alertMsg = 'Please wait! Your clip is being uploaded.';
    this.inSubmission = true;

    // For giving the clip an unique name/id - for not overriding on firebase
    const clipFileName = uuid()
    const clipPath = `clips/${clipFileName}.mp4`;

    // Uploading file to firebase
    const uploadTask = this.storage.upload(clipPath, this.file);
    // To track the uploading percentage status
    uploadTask.percentageChanges().subscribe(progress => {
      // By default we get the value multiplied by 100 i.e we get 10,000 - so divide by 100 to get the 100%
      this.percentage = (progress as number)/100;
    });
  }
}
