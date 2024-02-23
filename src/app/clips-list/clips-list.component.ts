import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-clips-list',
  templateUrl: './clips-list.component.html',
  styleUrl: './clips-list.component.scss'
})
export class ClipsListComponent implements OnInit, OnDestroy{
  
  constructor() {}
  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.handleScroll);
  }

  ngOnInit(): void {
    window.addEventListener('scroll', this.handleScroll);
  }

  handleScroll = () => {
    const { scrollTop,  offsetHeight} = document.documentElement;
    const { innerHeight } = window;

    const bottomOfPage = Math.round(scrollTop) + innerHeight === offsetHeight;

    if(bottomOfPage) {
      console.log('Bottom of Page');
    }
  }
}
