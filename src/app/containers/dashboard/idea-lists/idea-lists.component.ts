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
        <ul class="">
          <li class="list__option">
            <div class="list__image">
              <button type="button" class="close">
                <i class="fa fa-star" aria-hidden="true"></i>
              </button>
              <img class="" src="./assets/imgs/img_list-classicbears.svg">
            </div>
            <p class="list__label">Best Bear Ideas</p>
          </li>
          <li class="list__option">
            <div class="list__image">
              <button type="button" class="close">
                <i class="fa fa-star" aria-hidden="true"></i>
              </button>
              <img class="" src="./assets/imgs/img_list-sellrallies.svg">
            </div>
            <p class="list__label">Sell the Rallies</p>
          <li class="list__option">
            <div class="list__image">
              <button type="button" class="close">
                <i class="fa fa-star" aria-hidden="true"></i>
              </button>
              <img class="" src="./assets/imgs/img_list-largecap.svg">
            </div>
            <p class="list__label">Large Cap Bears</p>
          </li>
          <li class="list__option">
            <div class="list__image">
              <button type="button" class="close">
                <i class="fa fa-star" aria-hidden="true"></i>
              </button>
              <img class="" src="./assets/imgs/img_list-smallcap.svg">
            </div>
            <p class="list__label">Small Cap Bears</p>
          </li>
          <li class="list__option">
            <div class="list__image">
              <button type="button" class="close">
                <i class="fa fa-star" aria-hidden="true"></i>
              </button>
              <img class="" src="./assets/imgs/img_list-earningsbears.svg">
            </div>
            <p class="list__label">Upcoming Earnings Bears</p>
          </li>
          <li class="list__option">
            <div class="list__image">
              <button type="button" class="close">
                <i class="fa fa-star" aria-hidden="true"></i>
              </button>
              <img class="" src="./assets/imgs/img_list-PGRdowngrade.svg">
            </div>
            <p class="list__label">Power Gauge Downgrades</p>
          </li>
          <li class="list__option">
            <div class="list__image">
              <button type="button" class="close">
                <i class="fa fa-star" aria-hidden="true"></i>
              </button>
              <img class="" src="./assets/imgs/img_list-dontfighttheshorts.svg">
            </div>
            <p class="list__label">Don't Fight the&nbsp;Shorts</p>
          </li>
          <li class="list__option">
            <div class="list__image">
              <button type="button" class="close">
                <i class="fa fa-star" aria-hidden="true"></i>
              </button>
              <img class="" src="./assets/imgs/img_list-analystdarlings.svg">
            </div>
            <p class="list__label">Analyst Bears</p>
          </li>
        </ul>
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
