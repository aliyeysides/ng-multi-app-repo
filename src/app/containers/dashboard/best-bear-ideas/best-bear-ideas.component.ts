import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'cpt-best-bear-ideas',
  template: `
    <div class="insights__container insights__container--list">
      <div class="post-head">
        <div class="clearfix">
          <h4>Best Bear Ideas</h4>
          <a class="post-head__button">
            <i class="fa fa-external-link-square" aria-hidden="true"></i>
             <span>&nbsp;View List</span>
          </a>
        </div>
        <div class="col-header__container row">
          <div class="col-header col-sm-2">Rating</div>
          <div class="col-header col-sm-4">Ticker</div>
          <div class="col-header col-sm-3">Last Price</div>
          <div class="col-header col-sm-3">% Chg</div>
        </div>
      </div>
      <div class="post-body post-body--list">
      </div>
    </div>
  `,
  styleUrls: ['./best-bear-ideas.component.scss']
})
export class BestBearIdeasComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
