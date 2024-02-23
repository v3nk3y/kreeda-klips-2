import { Component, OnInit, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { DatePipe } from '@angular/common';
import IClip from '../models/clip.model';
import videojs from 'video.js';

@Component({
  selector: 'app-clip',
  templateUrl: './clip.component.html',
  styleUrls: ['./clip.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [DatePipe]
})
export class ClipComponent implements OnInit {
  @ViewChild('videoPlayer', { static: true }) target?: ElementRef;
  player?: videojs.Player
  clip?: IClip

  constructor(public route: ActivatedRoute) { }

  ngOnInit(): void {
    this.player = videojs(this.target?.nativeElement)
    this.route.data.subscribe(data => {
      // get the clip data from the resolver we created
      this.clip = data.clip as IClip;

      // Define the src and type of video clip
      this.player?.src({
        src: this.clip.url,
        type: 'video/mp4'
      })
    });
  }

}
