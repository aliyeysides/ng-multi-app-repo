import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'cpt-ideas',
  template: `
    <div class="ideas">
      <cpt-idea-lists></cpt-idea-lists>
    </div>
  `,
  styleUrls: ['./ideas.component.scss']
})
export class IdeasComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
