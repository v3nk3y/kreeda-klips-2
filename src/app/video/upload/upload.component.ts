import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app'
import { Router } from '@angular/router';
import { v4 as uuid } from 'uuid';
import { last, switchMap } from 'rxjs/operators';
import { ClipService } from '../../services/clip.service';
import { FfmpegService } from '../../services/ffmpeg.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnDestroy{
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
  showPercentage = false;

  // user details local storing purpose
  user: firebase.User | null = null;

  // upload task
  uploadTask? : AngularFireUploadTask

  // FormControl for Video title capture
  title = new FormControl('', [
    Validators.required,
    Validators.minLength(3),
  ]);

  // FormgGroup
  uploadForm = new FormGroup({
    title: this.title
  })

  constructor(
    private storage: AngularFireStorage,
    private auth: AngularFireAuth,
    private router: Router,
    private clipService: ClipService,
    public ffmpegService: FfmpegService,
  ) { 
    auth.user.subscribe(user => this.user = user);

    // Initialize the ffmpeg service ASAP
    this.ffmpegService.init();
  }

  ngOnDestroy(): void {
    // To Cancel the upload when user navigated away from page while uploading in progress
    this.uploadTask?.cancel();
  }


  storeFile($event: Event) {
    this.isDragover = false

    // let the TS know the event is of type DragEvent for Intellisense
    // Check if the event is Drag and Drop or else set this to button file upload event
    // Grab the file respectively or set to null if undefined
    this.file = ($event as DragEvent).dataTransfer ? 
    ($event as DragEvent).dataTransfer?.files?.item(0) ?? null :
    ($event.target as HTMLInputElement).files?.item(0) ?? null

    // If the file type is not video, then exit
    if(!this.file || this.file.type !== 'video/mp4'){
      return;
    }

    // Set the title of video to file name without extension
    this.title.setValue(
      this.file.name.replace(/\.[^/.]+$/, '')
    );
  
    this.nextStep = true
  }

  uploadFile() {
    // To disable form chnages while being uploaded
    this.uploadForm.disable();

    this.showAlert = true;
    this.alertColor = 'blue';
    this.alertMsg = 'Please wait! Your clip is being uploaded.';
    this.inSubmission = true;
    this.showPercentage = true;

    // For giving the clip an unique name/id - for not overriding on firebase
    const clipFileName = uuid()
    const clipPath = `clips/${clipFileName}.mp4`;

    // Uploading file to firebase
    this.uploadTask = this.storage.upload(clipPath, this.file);

    // referecne to clip on the path where it will be stored using angularfireStorage methods
    const clifRef = this.storage.ref(clipPath);

    // To track the uploading percentage status
    this.uploadTask.percentageChanges().subscribe(progress => {
      // By default we get the value multiplied by 100 i.e we get 10,000 - so divide by 100 to get the 100%
      this.percentage = (progress as number)/100;
    });

    this.uploadTask.snapshotChanges().pipe(
      // Wait for the last snapshot change
      last(),
      // Using switchmap to subscribe to the inner observable returned by getdownloadurl and grab the url
      switchMap(() => clifRef.getDownloadURL())
    ).subscribe({
      next: async (url) => {
        const clip = {
          uid: this.user?.uid as string,
          displayName: this.user?.displayName as string,
          title: this.title.value as string,
          fileName: `${clipFileName}.mp4` as string,
          url: url as string,
          timestamp: firebase.firestore.FieldValue.serverTimestamp() // To fetch the timestamp from firebase
        }
        // To get the details about the document like the 'id' in the collection which we use for routing purpose.
        const clipDocumentReference = await this.clipService.createClip(clip);
        this.alertColor = 'green'
        this.alertMsg = 'Success! Your clip has been uploaded.'
        this.showPercentage = false;
        console.log(clip);

        setTimeout(() => {
          this.router.navigate([
            'clip', clipDocumentReference.id
          ]);
        }, 1000);
      },
      error: (error) => {
        this.alertColor = 'red';
        this.alertMsg = 'Upload failed! Please try again later.'
        this.inSubmission = true;
        this.showPercentage = false;
        console.log(error);
        // To enable form for user to change data if needed
        this.uploadForm.enable();
      },
    });
  }
}
