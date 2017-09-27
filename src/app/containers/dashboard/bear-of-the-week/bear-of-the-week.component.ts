import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'cpt-bear-of-the-week',
  template: `
    <div class="insights__container insights__container--small">
      <div class="post-head post-head--bearpick">
        <h4>Bear of the Week</h4>
        <div class="divider-h"></div>
        <p class="header__post-date">Sept 27, 2017</p>
        <a class="post-head__button">
          <i class="fa fa-calendar" aria-hidden="true"></i>
           <span>&nbsp;Previous</span>
        </a>
      </div>
      <div class="post-body post-body--bearpick">
      </div>
    </div>
  `,
  styleUrls: ['./bear-of-the-week.component.scss']
})
export class BearOfTheWeekComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
