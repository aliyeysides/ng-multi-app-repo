import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'cpt-my-stocks',
  template: `
      <div class="container-fluid component component--mystocks">
        <div class="row contents">
          <div class="col-12" id="list--selected">
            <h3>Greg's stock list #2</h3>
            <div class="divider__long"></div>
            <ul class="stock__list">
              <li class="row col-headers">
                <div class="col-3">
                  <p>RATING</p>
                </div>
                <div class="col-3" style="padding-left:0;">
                  <p class="text-left">TICKER</p>
                </div>
                <div class="col-3">
                  <p>PRICE</p>
                </div>
                <div class="col-3">
                  <p>CHG</p>
                </div>
              </li>
              <li class="row list__entry">
                <div class="col-3 list-entry__pgr">
                  <img class="align-middle" src="./assets/imgs/arc_VeryBullish.svg">
                </div>
                <div class="col-3 list-entry__info">
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
                <div class="col-12 list-entry__overlay green">
                  <div class="row no-gutters overlay__contents">
                    <div class="button__slide">
                      <img src="./assets/imgs/ui_slide.svg">
                    </div>
                    <div class="col-2">
                      <img class="align-middle" src="./assets/imgs/icon_minus.svg">
                    </div>
                    <div class="col-4">
                      <p class="ticker">SHOP</p>
                    </div>
                    <div class="col-2">
                      <img class="align-middle" src="./assets/imgs/icon_arrow-up.svg">
                    </div>
                    <div class="col-4">
                      <p class="data">-2.34%</p>
                    </div>
                  </div>
                </div>
              </li>
              <li class="row list__entry">
                <div class="col-3 list-entry__pgr">
                  <img class="align-middle" src="./assets/imgs/arc_Bullish.svg">
                </div>
                <div class="col-3 list-entry__info">
                  <p class="ticker">JASO</p>
                  <p class="company">The Stock Josh Likes</p>
                </div>
                <div class="col-3 list-entry__data">
                  <p class="data green">39.30</p>
                </div>
                <div class="col-3 list-entry__data">
                  <p class="data green">2.28%</p>
                </div>
                <div class="button__slide">
                  <img src="./assets/imgs/ui_slide.svg">
                </div>
                <div class="col-12 list-entry__overlay green">
                  <div class="row no-gutters overlay__contents">
                    <div class="button__slide">
                      <img src="./assets/imgs/ui_slide.svg">
                    </div>
                    <div class="col-2">
                      <img class="align-middle" src="./assets/imgs/icon_minus.svg">
                    </div>
                    <div class="col-4">
                      <p class="ticker">JASO</p>
                    </div>
                    <div class="col-2">
                      <img class="align-middle" src="./assets/imgs/icon_arrow-up.svg">
                    </div>
                    <div class="col-4">
                      <p class="data">+2.28%</p>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <div class="col-12" id="list--recent">
            <h3>Recently Viewed</h3>
            <div class="divider__long"></div>
            <ul class="stock__list">
              <li class="row col-headers">
                <div class="col-3">
                  <p>RATING</p>
                </div>
                <div class="col-3" style="padding-left:0;">
                  <p class="text-left">TICKER</p>
                </div>
                <div class="col-3">
                  <p>PRICE</p>
                </div>
                <div class="col-3">
                  <p>CHG</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
  `,
  styleUrls: ['./my-stocks.component.scss']
})
export class MyStocksComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
