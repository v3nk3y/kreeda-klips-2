import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ClipService } from '../services/clip.service';
// We need to import the pipes
import { FireTimestampPipe } from '../pipes/fire-timestamp.pipe';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-clips-list',
  templateUrl: './clips-list.component.html',
  styleUrl: './clips-list.component.scss',
  providers: [FireTimestampPipe, DatePipe] // We need to register the pipes on component
})
export class ClipsListComponent implements OnInit, OnDestroy{
  @Input() scrollingEnabled = true;
  constructor(public clipService: ClipService) {
    // On component load, fetch the clips
    this.clipService.getClips();
  }

  ngOnDestroy(): void {
    if(this.scrollingEnabled) {
      window.removeEventListener('scroll', this.handleScroll);
    }
    // Reset page clips when moved away from this page, on component destroy
    this.clipService.pageClips = [];
  }

  ngOnInit(): void {
    if(this.scrollingEnabled){
      window.addEventListener('scroll', this.handleScroll);
    }
  }

  handleScroll = () => {
    const { scrollTop,  offsetHeight} = document.documentElement;
    const { innerHeight } = window;

    const bottomOfPage = Math.round(scrollTop) + innerHeight === offsetHeight;

    if(bottomOfPage) {
      // when the page bottom is reached, load next set of clips
      console.log('Bottom');
      this.clipService.getClips();
    }
  }
}
