import { Component, OnInit, Input } from '@angular/core';
import { NgElement, WithProperties } from '@angular/elements';
declare global {
  interface HTMLElementTagNameMap {
    'video-player': NgElement & WithProperties<{"data"}>;
  }
}
@Component({
  selector: 'video-player',
  templateUrl: './videoplayer.component.html',
  styleUrls: ['./videoplayer.component.scss']
})
 
export class VideoplayerComponent implements OnInit {
  @Input() data : string;

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit(){

  }

}
