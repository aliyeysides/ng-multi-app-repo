import { Component, OnInit } from '@angular/core';
import {BsModalRef} from 'ngx-bootstrap';

@Component({
  selector: 'cpt-full-list-modal',
  template: `
    <div class="insights__container insights__container--large insights__container--modal"> 
      <div class="post-head post-head--bearpick">
        <h2 class="">{{title}}</h2>
        <button type="button" class="post-head__button" aria-label="Close" (click)="bsModalRef.hide()">
          <a class="">
            <i class="fa fa-times-circle" aria-hidden="true"></i>
            <span>&nbsp;Close</span>
          </a>
        </button>
      </div>
      <div class="post-body">
        <div class="idea-list__container row no-gutters">
          <div class="idea-list__left-col col-sm-6 col-md-5 col-lg-4 col-xl-4">
            <ul class="idea-list__list">
              <li class="list__option selected">
                <div class="list__image">
                  <img class="" src="./assets/imgs/img_list-classicbears.svg">
                </div>
                <p class="list__label">Best Bear Ideas</p>
              </li>
              <li class="list__option">
                <div class="list__image">
                  <img class="" src="./assets/imgs/img_list-sellrallies.svg">
                </div>
                <p class="list__label">Sell the Rallies</p>
              <li class="list__option">
                <div class="list__image">
                  <img class="" src="./assets/imgs/img_list-largecap.svg">
                </div>
                <p class="list__label">Large Cap Bears</p>
              </li>
              <li class="list__option">
                <div class="list__image">
                  <img class="" src="./assets/imgs/img_list-smallcap.svg">
                </div>
                <p class="list__label">Small Cap Bears</p>
              </li>
              <li class="list__option">
                <div class="list__image">
                  <img class="" src="./assets/imgs/img_list-earningsbears.svg">
                </div>
                <p class="list__label">Upcoming Earnings Bears</p>
              </li>
              <li class="list__option">
                <div class="list__image">
                  <img class="" src="./assets/imgs/img_list-PGRdowngrade.svg">
                </div>
                <p class="list__label">Power Gauge Downgrades</p>
              </li>
              <li class="list__option">
                <div class="list__image">
                  <img class="" src="./assets/imgs/img_list-dontfighttheshorts.svg">
                </div>
                <p class="list__label">Don't Fight the&nbsp;Shorts</p>
              </li>
              <li class="list__option">
                <div class="list__image">
                  <img class="" src="./assets/imgs/img_list-analystdarlings.svg">
                </div>
                <p class="list__label">Analyst Bears</p>
              </li>
            </ul>
          </div>
          <div class="idea-list__right-col col-sm-6 col-md-7 col-lg-8 col-xl-8">
            <div class="idea-list__descriptions">
              <div class="list-description__header">
                <img src="./assets/imgs/img_list-classicbears--color.svg">
                <h3>Best Bear Ideas</h3>
                <a class="post-head__button">
                  <i class="fa fa-external-link-square" aria-hidden="true"></i>
                  <span>&nbsp;View List</span>
                </a>  
              </div>
              <div class="list-description__body">
                <div class="body__section">
                  <h6>What is this list?</h6>
                  <p>Mauris at tellus sed justo aliquet malesuada. Morbi cursus elit sit amet sem consequat, eget bibendum magna venenatis. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.</p>

                  <p>Fusce dui lorem, aliquet sit amet lectus vulputate, sollicitudin ultrices nulla. Donec pharetra arcu sed auctor pretium. Etiam ac elementum lacus. Mauris consequat neque non pellentesque aliquam.</p>
                </div>
                <div class="body__section">
                  <h6>How should I use this list?</h6>
                  <p>Pellentesque ornare tristique feugiat. Duis dictum congue sodales. Integer sagittis porttitor nisi, at faucibus eros sollicitudin non.</p>

                  <p>Etiam vel neque a enim pulvinar faucibus. Duis sollicitudin nisl odio, viverra consectetur elit fringilla eget. </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./full-list-modal.component.scss']
})
export class FullListModalComponent implements OnInit {
  public title: string;
  public list: any[] = [];

  constructor(public bsModalRef: BsModalRef) { }

  ngOnInit() {
    this.title = 'Idea List Descriptions';
  }

}
