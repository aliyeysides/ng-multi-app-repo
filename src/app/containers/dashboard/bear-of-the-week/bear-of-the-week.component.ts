import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'cpt-bear-of-the-week',
  template: `
    <div class="insights__container insights__container--small">
      <div class="post-head post-head--bearpick">
        <h4>Bear of the Week</h4>
        <div class="divider-h"></div>
        <p class="header__post-date">Sept 27</p>
        <a class="post-head__button">
          <i class="fa fa-calendar" aria-hidden="true"></i>
           <span>&nbsp;Previous</span>
        </a>
      </div>
      <div class="post-body post-body--bearpick">
        <div class="container">
          <div class="row">
            <div class="col-sm-6">
              <img class="rating" src="assets/imgs/arc_VeryBearish.svg">
              <p class="ticker">TSLA</p>
            </div>
            <div class="col-sm-6">
              <p class="data data--change down-change">-1.40%</p>
              <p class="data down-change">$336.19</p>
            </div>
          </div>
          <div class="row">
            <div class="col-sm-6">
              <p class="company-name">Telsa Motors</p>
            </div>
            <div class="col-sm-6">
              <p class="industry-name">Autos-Tires-Trucks</p>
            </div>
          </div>
          <div class="row">
            <div class="link__see-more col-sm-12">
              <a class="">See Commentary <i class="fa fa-long-arrow-right" aria-hidden="true"></i></a>
            </div>
          </div>
        </div>
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
