import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'cpt-idea-lists',
  template: `
    <div class="idea-lists__component container-fluid">
      <div class="idea-lists__header row no-gutters">
        <h3>Idea Lists</h3>
        <div class="divider-h"></div>
        <a>See List Descriptions <i class="fa fa-long-arrow-right" aria-hidden="true"></i></a>
      </div>
      <div class="idea-lists__container row no-gutters">
        
      </div>
    </div>

  `,
  styleUrls: ['./idea-lists.component.scss']
})
export class IdeaListsComponent implements OnInit {

  constructor() {
  }

  ngOnInit() {
  }

}
