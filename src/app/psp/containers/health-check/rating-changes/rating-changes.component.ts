import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'cpt-psp-rating-changes',
  template: `
    <div class="col-12 col-lg-8 col-xl-8 section section--ratingschanges">

      <div class="row">
        <div class="col-12">
          <h2>Ratings Changes</h2>
        </div>
      </div>

      <div class="row section__summary">
        <div class="col-12">
          <div class="row">
            <div class="col-6 summary--left">
              <p><img src="./assets/imgs/icon_circle-change--green.svg"> 2</p>
            </div>
            <div class="col-6 summary--right">
              <p><img src="./assets/imgs/icon_circle-change--red.svg"> 3</p>
            </div>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-12">
          <div class="divider"></div>
        </div>
      </div>

      <div class="row">
        <div class="col-12 col-md-6 section__contents">
          <h3 class="green">Turned Bullish</h3>
          <ul class="stock__list">
            <li class="row no-gutters list__entry">
              <div class="col-2 list-entry__pgr">
                <img class="align-middle" src="./assets/imgs/arc_VeryBullish.svg">
              </div>
              <div class="col-4 list-entry__info">
                <p class="ticker">SHOP</p>
                <p class="company">Shopify Inc</p>
              </div>
              <div class="col-3 list-entry__data">
                <p class="data green">99.40</p>
              </div>
              <div class="col-3 list-entry__data">
                <p class="data green">3.12%</p>
              </div>
              <div class="button__slide">
                <img src="./assets/imgs/ui_slide.svg">
              </div>
            </li>
            <li class="row no-gutters list__entry">
              <div class="col-2 list-entry__pgr">
                <img class="align-middle" src="./assets/imgs/arc_Bullish.svg">
              </div>
              <div class="col-4 list-entry__info">
                <p class="ticker">JASO</p>
                <p class="company">Amazon.Com Inc</p>
              </div>
              <div class="col-3 list-entry__data">
                <p class="data green">34.52</p>
              </div>
              <div class="col-3 list-entry__data">
                <p class="data green">1.45%</p>
              </div>
              <div class="button__slide">
                <img src="./assets/imgs/ui_slide.svg">
              </div>
            </li>
          </ul>
        </div>

        <div class="col-12 hidden-md-up">
          <div class="divider"></div>
        </div>

        <div class="col-12 col-md-6 section__contents">
          <h3 class="red">Turned Bearish</h3>
          <ul class="stock__list">
            <li class="row no-gutters list__entry">
              <div class="col-2 list-entry__pgr">
                <img class="align-middle" src="./assets/imgs/arc_VeryBearish.svg">
              </div>
              <div class="col-4 list-entry__info">
                <p class="ticker">YUM</p>
                <p class="company">Shopify Inc</p>
              </div>
              <div class="col-3 list-entry__data">
                <p class="data red">99.40</p>
              </div>
              <div class="col-3 list-entry__data">
                <p class="data red">3.12%</p>
              </div>
              <div class="button__slide">
                <img src="./assets/imgs/ui_slide.svg">
              </div>
            </li>
            <li class="row no-gutters list__entry">
              <div class="col-2 list-entry__pgr">
                <img class="align-middle" src="./assets/imgs/arc_Bearish.svg">
              </div>
              <div class="col-4 list-entry__info">
                <p class="ticker">MINI</p>
                <p class="company">Amazon.Com Inc</p>
              </div>
              <div class="col-3 list-entry__data">
                <p class="data red">34.52</p>
              </div>
              <div class="col-3 list-entry__data">
                <p class="data red">1.45%</p>
              </div>
              <div class="button__slide">
                <img src="./assets/imgs/ui_slide.svg">
              </div>
            </li>
            <li class="row no-gutters list__entry">
              <div class="col-2 list-entry__pgr">
                <img class="align-middle" src="./assets/imgs/arc_Bearish.svg">
              </div>
              <div class="col-4 list-entry__info">
                <p class="ticker">TSLA</p>
                <p class="company">Tesla Motors</p>
              </div>
              <div class="col-3 list-entry__data">
                <p class="data red">34.52</p>
              </div>
              <div class="col-3 list-entry__data">
                <p class="data red">1.45%</p>
              </div>
              <div class="button__slide">
                <img src="./assets/imgs/ui_slide.svg">
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div class="row">
        <div class="col-12">
          <div class="divider"></div>
        </div>
      </div>

      <div class="row">
        <div class="col-12 expand-collapse">
          <img src="./assets/imgs/icon_chevron--up.svg">
          <p>COLLAPSE</p>
        </div>
      </div>

      <div class="row">
        <div class="col-12">
          <div class="divider__long divider__long--green"></div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['../health-check.component.scss']
})
export class RatingChangesComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
