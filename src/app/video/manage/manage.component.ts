import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
// import { ClipService } from 'src/app/services/clip.service';
import IClip from '../../models/clip.model';
// import { ModalService } from 'src/app/services/modal.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {
  videoOrder = '1'
  clips: IClip[] = []
  activeClip: IClip | null = null
  sort$: BehaviorSubject<string>

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    // private clipService: ClipService,
    // private modal: ModalService
  ) { 
    this.sort$ = new BehaviorSubject(this.videoOrder)
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: Params) => {
      this.videoOrder = params.sort === '2' ? params.sort : '1'
      this.sort$.next(this.videoOrder)
    })
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

  
}
