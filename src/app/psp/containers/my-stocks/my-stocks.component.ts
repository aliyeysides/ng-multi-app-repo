import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'cpt-my-stocks',
  template: `
      <div class="component component--mystocks">
        <div class="row no-gutters contents">
          <div class="col-12 section list__current">
            <ul class="stock__list">
              <li class="row no-gutters col-headers">
                <div class="col-2 sort sorted">
                  <p>RATING</p>
                </div>
                <div class="col-4 sort">
                  <p style="text-align: left;">TICKER</p>
                </div>
                <div class="col-3 sort">
                  <p>PRICE</p>
                </div>
                <div class="col-3 sort">
                  <p>CHANGE</p>
                </div>
              </li>
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
              <li class="row no-gutters list__entry">
                <div class="col-2 list-entry__pgr">
                  <img class="align-middle" src="./assets/imgs/arc_VeryBearish.svg">
                </div>
                <div class="col-4 list-entry__info">
                  <p class="ticker">YUM</p>
                  <p class="company">YUM! Inc</p>
                </div>
                <div class="col-3 list-entry__data">
                  <p class="data red">30.87</p>
                </div>
                <div class="col-3 list-entry__data">
                  <p class="data red">-1.11</p>
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
              <li class="row no-gutters list__entry">
                <div class="col-2 list-entry__pgr">
                  <img class="align-middle" src="./assets/imgs/arc_Neutral.svg">
                </div>
                <div class="col-4 list-entry__info">
                  <p class="ticker">GOOGL</p>
                  <p class="company">Alphabet Corp. A</p>
                </div>
                <div class="col-3 list-entry__data">
                  <p class="data green">1234.52</p>
                </div>
                <div class="col-3 list-entry__data">
                  <p class="data green">8.19%</p>
                </div>
                <div class="button__slide">
                  <img src="./assets/imgs/ui_slide.svg">
                </div>
                <div class="col-12 list-entry__overlay show green">
                  <div class="row no-gutters overlay__contents">
                    <div class="button__slide">
                      <img src="./assets/imgs/ui_slide.svg">
                    </div>
                    <div class="col-2">
                      <img class="align-middle" src="./assets/imgs/icon_minus.svg">
                    </div>
                    <div class="col-4">
                      <p class="ticker">GOOGL</p>
                    </div>
                    <div class="col-2">
                      <img class="align-middle" src="./assets/imgs/icon_arrow-up.svg">
                    </div>
                    <div class="col-4">
                      <p class="data">+8.19%</p>
                    </div>
                  </div>
                </div>
              </li>
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
              <li class="row no-gutters list__entry">
                <div class="col-2 list-entry__pgr">
                  <img class="align-middle" src="./assets/imgs/arc_VeryBullish.svg">
                </div>
                <div class="col-4 list-entry__info">
                  <p class="ticker">SHOP</p>
                  <p class="company">Shopify Inc</p>
                </div>
                <div class="col-3 list-entry__data">
                  <p class="data red">66.23</p>
                </div>
                <div class="col-3 list-entry__data">
                  <p class="data red">-4.11%</p>
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
            </ul>
          </div>
          <div class="col-12 section list__recent">
            <h3 class="ux-blue">Recently Viewed &nbsp;<i class="fa fa-refresh" aria-hidden="true"></i></h3>
            <div class="divider__long divider__long--blue"></div>
            <ul class="stock__list">
              <li class="row no-gutters col-headers">
                <div class="col-2">
                  <p style="text-align: left;">RATING <i class="fa fa-sort-desc" aria-hidden="true"></i></p>
                </div>
                <div class="col-4">
                  <p style="text-align: left;">TICKER <i class="fa fa-sort" aria-hidden="true"></i></p>
                </div>
                <div class="col-3">
                  <p>PRICE <i class="fa fa-sort" aria-hidden="true"></i></p>
                </div>
                <div class="col-3">
                  <p>CHANGE <i class="fa fa-sort" aria-hidden="true"></i></p>
                </div>
              </li>
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
              <li class="row no-gutters list__entry">
                <div class="col-2 list-entry__pgr">
                  <img class="align-middle" src="./assets/imgs/arc_VeryBearish.svg">
                </div>
                <div class="col-4 list-entry__info">
                  <p class="ticker">YUM</p>
                  <p class="company">YUM! Inc</p>
                </div>
                <div class="col-3 list-entry__data">
                  <p class="data red">30.87</p>
                </div>
                <div class="col-3 list-entry__data">
                  <p class="data red">-1.11</p>
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
              <li class="row no-gutters list__entry">
                <div class="col-2 list-entry__pgr">
                  <img class="align-middle" src="./assets/imgs/arc_Neutral.svg">
                </div>
                <div class="col-4 list-entry__info">
                  <p class="ticker">GOOGL</p>
                  <p class="company">Alphabet Corp. A</p>
                </div>
                <div class="col-3 list-entry__data">
                  <p class="data green">1234.52</p>
                </div>
                <div class="col-3 list-entry__data">
                  <p class="data green">8.19%</p>
                </div>
                <div class="button__slide">
                  <img src="./assets/imgs/ui_slide.svg">
                </div>
                <div class="col-12 list-entry__overlay show green">
                  <div class="row no-gutters overlay__contents">
                    <div class="button__slide">
                      <img src="./assets/imgs/ui_slide.svg">
                    </div>
                    <div class="col-2">
                      <img class="align-middle icon" src="./assets/imgs/icon_minus.svg">
                    </div>
                    <div class="col-4">
                      <p class="ticker">GOOGL</p>
                    </div>
                    <div class="col-2">
                      <img class="align-middle" src="./assets/imgs/icon_arrow-up.svg">
                    </div>
                    <div class="col-4">
                      <p class="data">+8.19%</p>
                    </div>
                  </div>
                </div>
              </li>
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
