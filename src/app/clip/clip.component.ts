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

  id = '';
  clip?: IClip

  constructor(public route: ActivatedRoute) { }

  ngOnInit(): void {
    this.player = videojs(this.target?.nativeElement)
    this.route.params.subscribe((params: Params) => {
      this.id = params.id;
    })
  }

}
