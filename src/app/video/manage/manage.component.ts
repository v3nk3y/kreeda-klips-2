import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import IClip from '../../models/clip.model';
import { BehaviorSubject } from 'rxjs';
import { ClipService } from '../../services/clip.service';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {
  videoOrder = '1';
  // to store the user clips
  clips: IClip[] = [];
  // to determine the active clip
  activeClip: IClip | null = null;

  sort$: BehaviorSubject<string>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private clipService: ClipService,
    private modal: ModalService
  ) { 
    this.sort$ = new BehaviorSubject(this.videoOrder)
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: Params) => {
      this.videoOrder = params.sort === '2' ? params.sort : '1'
      this.sort$.next(this.videoOrder)
    })
    this.clipService.getUserClips().subscribe(docs => {
      // Empty clips array before retrieving the clips
      this.clips = []

      docs.forEach(doc => {
        // Loop over each doc record and push it to the clips array as per Iclip data model
        this.clips.push({
          docID: doc.id, // doc id is stored seperately so retrive it seperately
          ...doc.data(), // for remaining data using ...spread operator
        })
      })
    });
  }

  sort(event: Event) {
    const { value } = (event.target as HTMLSelectElement);
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        sort: value
      }
    })
  }

  openModal($event: Event, clip: IClip) {
    $event.preventDefault();
    this.activeClip = clip;
    this.modal.toggleModal('editClip');
  }

  update(updatedClipEvent: IClip) {
    // For updating- loop over the clips 
    this.clips.forEach((element, index) => {
      // For each clip check if the docID
      if(element.docID == updatedClipEvent.docID) {
        // If matched then grab and update tht title to reflect on the page
        this.clips[index].title = updatedClipEvent.title;
      }
    })
  }

  deleteClip($event: Event, clip: IClip) {
    $event.preventDefault();

    this.clipService.deleteClip(clip);

    // For deleting clip from the list - loop over the clips 
    this.clips.forEach((element, index) => {
      // For each clip check if the docID
      if(element.docID == clip.docID) {
        // If matched then delete the clip form the list
        // Remove the item form the array
        this.clips.splice(index, 1);
      }
    })
  }
  
}
