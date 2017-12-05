import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'cpt-stock-report',
  template: `
    <div class="component--stockview bearish open">

    <!-- STOCK VIEW HEADER -->
      <div class="stockview__header">
        <div class="header__button header__button--left">
          <img class="align-absolute" src="./assets/imgs/icon_back-arrow--white.svg">
        </div>
        <div class="header__stock">
          <h1 class="ticker">AMZN</h1>
          <p class="company-name">Amazon.Com Inc</p>
        </div>
        <div class="header__button header__button--right">
          <img class="align-absolute" src="./assets/imgs/icon_plus--white.svg">
        </div>
      </div>

    <!-- STOCK VIEW CONTENTS -->
      <div class="container-fluid stockview__contents">

      <!-- STOCK VIEW TOP --> 
        <div class="row stock-info">
          <div class="col-12">
            <div class="tab--slide"></div>
          </div>
          <div class="col-12 stockview__main-rating">
            <p class="label">Power Gauge Rating &nbsp;<a><i class="fa fa-info-circle" aria-hidden="true"></i></a>
            <p class="rating">
              <img src="./assets/imgs/arc_Bearish.svg">
              <span class="red">Bearish</span>
            </p>
          </div>
          <div class="col-12 stockview__PGR">
            <!--    <ul *ngIf="stock" class="pgr__sliders">
                    <li>
                      <div class="row sliderBar-container">
                        <div class="col-6 pgr__label">
                          <p>LT Debt to Equity</p>
                        </div>
                        <div class="col-5 sliderProgress">
                          <div [ngClass]="appendSliderClass(stock['pgr_factors_rating']['financial'])"></div>
                          <div class="sliderBar"
                               [ngClass]="appendSliderBarClass(stock['pgr_factors_rating']['financial'])"
                               role="progressbar" aria-valuemin="0" aria-valuemax="100">
                          </div>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div class="row sliderBar-container">
                        <div class="col-6 pgr__label">
                          <p>Price to Book</p>
                        </div>                    
                        <div class="col-5 sliderProgress">
                          <div [ngClass]="appendSliderClass(stock['pgr_factors_rating']['earning'])"></div>
                          <div class="sliderBar"
                               [ngClass]="appendSliderBarClass(stock['pgr_factors_rating']['earning'])"
                               role="progressbar" aria-valuemin="0" aria-valuemax="100">
                          </div>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div class="row sliderBar-container">
                      <div class="col-6 pgr__label">
                          <p>Return on Equity</p>
                        </div>
                        <div class="col-5 sliderProgress">
                          <div [ngClass]="appendSliderClass(stock['pgr_factors_rating']['technical'])"></div>
                          <div class="sliderBar"
                               [ngClass]="appendSliderBarClass(stock['pgr_factors_rating']['technical'])"
                               role="progressbar" aria-valuemin="0" aria-valuemax="100">
                          </div>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div class="row sliderBar-container">
                        <div class="col-6 pgr__label">
                          <p>Price to Sales</p>
                        </div>
                        <div class="col-5 sliderProgress">
                          <div [ngClass]="appendSliderClass(stock['pgr_factors_rating']['expert'])"></div>
                          <div class="sliderBar"
                               [ngClass]="appendSliderBarClass(stock['pgr_factors_rating']['expert'])"
                               role="progressbar" aria-valuemin="0" aria-valuemax="100">
                          </div>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div class="row sliderBar-container">
                        <div class="col-6 pgr__label">
                          <p>Free Cash Flow</p>
                        </div>
                        <div class="col-5 sliderProgress">
                          <div [ngClass]="appendSliderClass(stock['pgr_factors_rating']['expert'])"></div>
                          <div class="sliderBar"
                               [ngClass]="appendSliderBarClass(stock['pgr_factors_rating']['expert'])"
                               role="progressbar" aria-valuemin="0" aria-valuemax="100">
                          </div>
                        </div>
                      </div>
                    </li>
                </ul> -->
          </div>
        </div>
        <div class="row">
          <div class="col-12">
            <div class="divider__long"></div>
          </div>
        </div>

      <!-- STOCK VIEW PRICE -->
        <div class="row stock-info stock-info--price">
          <div class="col-12">
            <p class="current-price red"><sub>$</sub>1108<sub>.22</sub></p>
          </div>
          <div class="col-4">
            <p class="data red">1107.23</p>
            <p class="label">OPEN</p>
          </div>
          <div class="col-4">
            <p class="data red">-1.25</p>
            <p class="label">$ CHG</p>
          </div>
          <div class="col-4">
            <p class="data red">(-3.22)</p>
            <p class="label">% CHG</p>
          </div>
        </div>
        <div class="row">
          <div class="col-12">
            <div class="divider__long"></div>
          </div>
        </div>

      <!-- STOCK VIEW CHART HEADER -->
        <div class="row stock-info stock-info--chart-toggle">
          <div class="col-12">
            <p class="chart-header__breakdown">Down <span class="red">-12.02 &nbsp;(-3.23%)</span> over the last&hellip;</p>
          </div>
          <div class="col-2">
            <p class="date-select">1D</p>
          </div>
          <div class="col-2">
            <p class="date-select">1W</p>
          </div>
          <div class="col-2">
            <p class="date-select">1M</p>
          </div>
          <div class="col-2">
            <p class="date-select selected">6M</p>
          </div>
          <div class="col-2">
            <p class="date-select">1Y</p>
          </div>
          <div class="col-2">
            <p class="date-select">5Y</p>
          </div>
        </div>

      <!-- STOCK VIEW MAIN CHART -->
        <div class="row stock-info stock-info--chart">
          <div class="col-12 main-chart bearish">
          </div>
        </div>

      <!-- STOCK VIEW MONEYFLOW -->
        <div class="row stock-info stock-info--chart">
          <div class="col-12 "></div>
        </div>

      <!-- STOCK VIEW REL STRENGTH -->
        <div class="row stock-info stock-info--chart">
          <div class="col-12 "></div>
        </div>

        <div class="row">
          <div class="col-12">
            <div class="divider__long  divider__long--red"></div>
          </div>
        </div>

      <!-- STOCK VIEW STATS -->
        <div class="row stock-info stock-info--stats">
          <div class="col-12">
            <h2>Today's Stats</h2>
          </div>
          <div class="col-4">
            <p class="data data--large">10.47<sub>M</sub></p>
            <p class="label">REVENUE</p>            
          </div>
          <div class="col-4">
            <p class="data data--large">178.6<sub>B</sub></p>
            <p class="label">MKT CAP</p>
          </div>
          <div class="col-4">
            <p class="data data--large">0<sub>%</sub></p>
            <p class="label">YIELD</p>            
          </div>
        </div>
        <div class="row">
          <div class="col-12">
            <div class="divider__long"></div>
          </div>
        </div>

      <!-- STOCK VIEW STATS -->       
        <div class="row stock-info stock-info--stats">
          <div class="col-3">
            <p class="data">1108<sub>.65</sub></p>
            <p class="label">OPEN</p>           
          </div>
          <div class="col-3">
            <p class="data">1111<sub>.65</sub></p>
            <p class="label">HIGH</p>
          </div>
          <div class="col-3">
            <p class="data">1107<sub>.65</sub></p>
            <p class="label">LOW</p>            
          </div>
          <div class="col-3">
            <p class="data">-- --</p>
            <p class="label">CLOSE</p>            
          </div>
        </div>
        <div class="row">
          <div class="col-12">
            <div class="divider__long"></div>
          </div>
        </div>

      <!-- STOCK VIEW STATS -->
        <div class="row stock-info stock-info--stats">
          <div class="col-12 stock-industry">
            <p class="data">Consumer Discretionary</p>
            <p class="label">INDUSTRY</p>           
          </div>
          <div class="col-12 stock-industry">
            <p class="data">Non-Food Retail/Wholesale</p>
            <p class="label">SECTOR</p>           
          </div>
        </div>
        <div class="row">
          <div class="col-12">
            <div class="divider__long divider__long--red"></div>
          </div>
        </div>

      <!-- STOCK VIEW NEWS -->
        <div class="row stock-info stock-info--news">
          <div class="col-12">
            <h2>Recent News</h2>
          </div>

          <div class="col-12">
            <div class="divider__long"></div>
          </div>
          <div class="col-1 chevron-slider chevron-slider--left">
            <img class="align-absolute"  src="./assets/imgs/ui_chevron--left.svg">
          </div>
          <ul class="col-10 news__slider">
            <li class="container">
              <div class="row">
                <div class="col-12">
                  <p class="headline">Google broadens takedown of extremist YouTube videos&nbsp;→</p>
                </div>
                <div class="col-6">
                  <p class="source">News Source</p>               
                </div>
                <div class="col-6">
                  <p class="date">Date published</p>    
                </div>              
              </div>
            </li>
            <li class="container">
              <div class="row">
                <div class="col-12">
                  <p class="headline">Google broadens takedown of extremist YouTube videos&nbsp;→</p>
                </div>
                <div class="col-6">
                  <p class="source">News Source</p>               
                </div>
                <div class="col-6">
                  <p class="date">Date published</p>    
                </div>              
              </div>
            </li>
            <li class="container">
              <div class="row">
                <div class="col-12">
                  <p class="headline">Google broadens takedown of extremist YouTube videos&nbsp;→</p>
                </div>
                <div class="col-6">
                  <p class="source">News Source</p>               
                </div>
                <div class="col-6">
                  <p class="date">Date published</p>    
                </div>              
              </div>
            </li>
          </ul>
          <div class="col-1 chevron-slider chevron-slider--right">
            <img class="align-absolute" src="./assets/imgs/ui_chevron--right.svg">
          </div>
          <div class="col-12">
            <div class="divider__long"></div>
          </div>
          <div class="col-12 news__pagination">
            <p>[ <span>2</span> of <span>8</span> ]</p>
          </div>
        </div>
        <div class="row">
          <div class="col-12">
            <div class="divider__long divider__long--red"></div>
          </div>
        </div>

      <!-- STOCK VIEW BREAKDOWN -->
        <div class="row stock-info stock-info--overall-breakdown">
          <div class="col-12">
            <h2>Rating <span>Breakdown</span></h2>
          </div>    

          <div class="col-12 copy-block">
            <p class="rating"><span>AMZN</span> is <span class="red">Bearish</span></p>
            <p class="paragraph"><span>Amazon.Com Inc:</span> Wodio ut vitae sagittis felis. Pellentesque quis vehicula enim, vitae suscipit nisl. Duis elit felis, pharetra sed lectus eu, pretium pretium lorem. Donec eu plac onec eu plact purus.</p>
            <p class="paragraph"> Duis elit felis, pharetra sed lectus eu, pretium pretium lorem. Donec eu plac onec eu urus.</p>
          </div>
          <div class="col-12">
            <div class="divider__long divider__long--red"></div>
          </div>  
        </div>

      <!-- BREAKDOWN - FINANCIALS --> 
        <div class="row stock-info stock-info--breakdown">
          <div class="col-12">
            <h1>Financials: <span class="red">Very Bearish</span></h1>
          </div>

          <div class="col-12 stockview__PGR">
            <!--    <ul *ngIf="stock" class="pgr__sliders">
                    <li>
                      <div class="row sliderBar-container">
                        <div class="col-6 pgr__label">
                          <p>LT Debt to Equity</p>
                        </div>
                        <div class="col-5 sliderProgress">
                          <div [ngClass]="appendSliderClass(stock['pgr_factors_rating']['financial'])"></div>
                          <div class="sliderBar"
                               [ngClass]="appendSliderBarClass(stock['pgr_factors_rating']['financial'])"
                               role="progressbar" aria-valuemin="0" aria-valuemax="100">
                          </div>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div class="row sliderBar-container">
                        <div class="col-6 pgr__label">
                          <p>Price to Book</p>
                        </div>                    
                        <div class="col-5 sliderProgress">
                          <div [ngClass]="appendSliderClass(stock['pgr_factors_rating']['earning'])"></div>
                          <div class="sliderBar"
                               [ngClass]="appendSliderBarClass(stock['pgr_factors_rating']['earning'])"
                               role="progressbar" aria-valuemin="0" aria-valuemax="100">
                          </div>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div class="row sliderBar-container">
                      <div class="col-6 pgr__label">
                          <p>Return on Equity</p>
                        </div>
                        <div class="col-5 sliderProgress">
                          <div [ngClass]="appendSliderClass(stock['pgr_factors_rating']['technical'])"></div>
                          <div class="sliderBar"
                               [ngClass]="appendSliderBarClass(stock['pgr_factors_rating']['technical'])"
                               role="progressbar" aria-valuemin="0" aria-valuemax="100">
                          </div>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div class="row sliderBar-container">
                        <div class="col-6 pgr__label">
                          <p>Price to Sales</p>
                        </div>
                        <div class="col-5 sliderProgress">
                          <div [ngClass]="appendSliderClass(stock['pgr_factors_rating']['expert'])"></div>
                          <div class="sliderBar"
                               [ngClass]="appendSliderBarClass(stock['pgr_factors_rating']['expert'])"
                               role="progressbar" aria-valuemin="0" aria-valuemax="100">
                          </div>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div class="row sliderBar-container">
                        <div class="col-6 pgr__label">
                          <p>Free Cash Flow</p>
                        </div>
                        <div class="col-5 sliderProgress">
                          <div [ngClass]="appendSliderClass(stock['pgr_factors_rating']['expert'])"></div>
                          <div class="sliderBar"
                               [ngClass]="appendSliderBarClass(stock['pgr_factors_rating']['expert'])"
                               role="progressbar" aria-valuemin="0" aria-valuemax="100">
                          </div>
                        </div>
                      </div>
                    </li>
                </ul> -->
          </div>
          <div class="col-12">
            <div class="divider__long"></div>
          </div>

          <div class="col-12 copy-block">
            <p class="paragraph"><span>AMZN's</span> financial metrics are very poor. The company is carrying too much long term debt and may be overvalued.</p>
            <p class="paragraph">The factor rank is based on the stock having high long term debt to equity ratio, high price to book value, high price to sales ratio, and relatively low cash flow, but high return on equity.</p>
          </div>

          <div class="col-12 data-table">
            <div class="row">
              <div class="col-6 col-md-3">
                <table>
                  <th colspan="2">Assets &amp; Liabilities</th>
                  <tr>
                    <td class="label">Current Ratio</td>
                    <td class="data">1.39</td>
                  </tr>
                  <tr>
                    <td class="label">LT Debt/ Equity</td>
                    <td class="data">0.68</td>
                  </tr>
                  <tr>
                    <td class="label">% Earn on Eqty</td>
                    <td class="data">35.40%</td>
                  </tr>
                  <tr>
                    <td class="label">Book Value</td>
                    <td class="data">$6.37</td>
                  </tr>
                </table>
              </div>
              <div class="col-6 col-md-3">
                <table>
                  <th colspan="2">Valuation</th>
                  <tr>
                    <td class="label">Price/Earnings</td>
                    <td class="data">18.40</td>
                  </tr>
                  <tr>
                    <td class="label">PEG</td>
                    <td class="data">1.69</td>
                  </tr>
                  <tr>
                    <td class="label">Price to Book</td>
                    <td class="data">$6.37</td>
                  </tr>
                  <tr>
                    <td class="label">Price to Sales</td>
                    <td class="data">3.88</td>
                  </tr>
                </table>
              </div>
              <div class="col-6 col-md-3">
                <table>
                  <th colspan="2">Dividends</th>
                  <tr>
                    <td class="label">Div per Share</td>
                    <td class="data">0.68</td>
                  </tr>
                  <tr>
                    <td class="label">Payout</td>
                    <td class="data">$0.29</td>
                  </tr>
                  <tr>
                    <td class="label">Yield</td>
                    <td class="data">1.65%</td>
                  </tr>
                  <tr>
                    <td class="label">Ex-Dividend Date</td>
                    <td class="data">8/9/17</td>
                  </tr>
                </table>
              </div>
              <div class="col-6 col-md-3">
                <table>
                  <th colspan="2">Returns</th>
                  <tr>
                    <td class="label">On Investment</td>
                    <td class="data">21.94%</td>
                  </tr>
                  <tr>
                    <td class="label">On Equity</td>
                    <td class="data">35.40%</td>
                  </tr>
                  <tr>
                    <td class="label">1 Month Return</td>
                    <td class="data">0.00%</td>
                  </tr>
                  <tr>
                    <td class="label">3 Month Return</td>
                    <td class="data">0.00%</td>
                  </tr>
                </table>
              </div>
            </div>
          </div>

          <div class="col-12 expand-collapse">
            <img src="./assets/imgs/icon_chevron--up.svg">
            <p>COLLAPSE</p>
          </div>

          <div class="col-12">
            <div class="divider__long divider__long--red"></div>
          </div>
        </div>

      <!-- BREAKDOWN - EARNINGS --> 
        <div class="row stock-info stock-info--breakdown">
          <div class="col-12">
            <h1>Earnings: <span class="yellow">Neutral</span></h1>
          </div>

          <div class="col-12 stockview__PGR">
            <!--    <ul *ngIf="stock" class="pgr__sliders">
                    <li>
                      <div class="row sliderBar-container">
                        <div class="col-6 pgr__label">
                          <p>LT Debt to Equity</p>
                        </div>
                        <div class="col-5 sliderProgress">
                          <div [ngClass]="appendSliderClass(stock['pgr_factors_rating']['financial'])"></div>
                          <div class="sliderBar"
                               [ngClass]="appendSliderBarClass(stock['pgr_factors_rating']['financial'])"
                               role="progressbar" aria-valuemin="0" aria-valuemax="100">
                          </div>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div class="row sliderBar-container">
                        <div class="col-6 pgr__label">
                          <p>Price to Book</p>
                        </div>                    
                        <div class="col-5 sliderProgress">
                          <div [ngClass]="appendSliderClass(stock['pgr_factors_rating']['earning'])"></div>
                          <div class="sliderBar"
                               [ngClass]="appendSliderBarClass(stock['pgr_factors_rating']['earning'])"
                               role="progressbar" aria-valuemin="0" aria-valuemax="100">
                          </div>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div class="row sliderBar-container">
                      <div class="col-6 pgr__label">
                          <p>Return on Equity</p>
                        </div>
                        <div class="col-5 sliderProgress">
                          <div [ngClass]="appendSliderClass(stock['pgr_factors_rating']['technical'])"></div>
                          <div class="sliderBar"
                               [ngClass]="appendSliderBarClass(stock['pgr_factors_rating']['technical'])"
                               role="progressbar" aria-valuemin="0" aria-valuemax="100">
                          </div>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div class="row sliderBar-container">
                        <div class="col-6 pgr__label">
                          <p>Price to Sales</p>
                        </div>
                        <div class="col-5 sliderProgress">
                          <div [ngClass]="appendSliderClass(stock['pgr_factors_rating']['expert'])"></div>
                          <div class="sliderBar"
                               [ngClass]="appendSliderBarClass(stock['pgr_factors_rating']['expert'])"
                               role="progressbar" aria-valuemin="0" aria-valuemax="100">
                          </div>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div class="row sliderBar-container">
                        <div class="col-6 pgr__label">
                          <p>Free Cash Flow</p>
                        </div>
                        <div class="col-5 sliderProgress">
                          <div [ngClass]="appendSliderClass(stock['pgr_factors_rating']['expert'])"></div>
                          <div class="sliderBar"
                               [ngClass]="appendSliderBarClass(stock['pgr_factors_rating']['expert'])"
                               role="progressbar" aria-valuemin="0" aria-valuemax="100">
                          </div>
                        </div>
                      </div>
                    </li>
                </ul> -->
          </div>

          <div class="col-12">
            <div class="divider__long"></div>
          </div>

          <div class="col-12 copy-block">
            <p class="paragraph"><span>AMZN's</span> earnings performance has been strong. The company has a history of strong earnings growth and has outperformed analysts' earnings estimates.</p>
            <p class="paragraph">The factor rank is based on the stock having high earnings growth over the past 3-5 years, better than expected earnings in recent quarters, and consistent earnings over the past 5 years, but a relatively poor yearly earnings trend, and a relatively high projected P/E ratio.</p>
          </div>

          <div class="col-12">
            <div class="chart__header">
              <h3>Annual EPS</h3>
            </div>
            <div class="chart">
            </div>
          </div>
          <div class="col-12">
            <div class="chart__header">
              <h3>Quarterly EPS</h3>
            </div>
            <div class="chart">
            </div>
          </div>
          <div class="col-12">
            <div class="chart__header">
              <h3>Earnings Announcement</h3>
            </div>
            <div class="chart">
            </div>
          </div>
          <div class="col-12">
            <div class="chart__header">
              <h3>Annual Revenue</h3>
            </div>
            <div class="chart">
            </div>
          </div>

          <div class="col-12 expand-collapse">
            <img src="./assets/imgs/icon_chevron--down.svg">
            <p>EXPAND</p>
          </div>

          <div class="col-12">
            <div class="divider__long divider__long--red"></div>
          </div> 
        </div>

      <!-- BREAKDOWN - TECHNICALS --> 
        <div class="row stock-info stock-info--breakdown">
          <div class="col-12">
            <h1>Technicals: <span class="red">Very Bearish</span></h1>
          </div>
          <div class="col-12 stockview__PGR">
            <!--    <ul *ngIf="stock" class="pgr__sliders">
                    <li>
                      <div class="row sliderBar-container">
                        <div class="col-6 pgr__label">
                          <p>LT Debt to Equity</p>
                        </div>
                        <div class="col-5 sliderProgress">
                          <div [ngClass]="appendSliderClass(stock['pgr_factors_rating']['financial'])"></div>
                          <div class="sliderBar"
                               [ngClass]="appendSliderBarClass(stock['pgr_factors_rating']['financial'])"
                               role="progressbar" aria-valuemin="0" aria-valuemax="100">
                          </div>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div class="row sliderBar-container">
                        <div class="col-6 pgr__label">
                          <p>Price to Book</p>
                        </div>                    
                        <div class="col-5 sliderProgress">
                          <div [ngClass]="appendSliderClass(stock['pgr_factors_rating']['earning'])"></div>
                          <div class="sliderBar"
                               [ngClass]="appendSliderBarClass(stock['pgr_factors_rating']['earning'])"
                               role="progressbar" aria-valuemin="0" aria-valuemax="100">
                          </div>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div class="row sliderBar-container">
                      <div class="col-6 pgr__label">
                          <p>Return on Equity</p>
                        </div>
                        <div class="col-5 sliderProgress">
                          <div [ngClass]="appendSliderClass(stock['pgr_factors_rating']['technical'])"></div>
                          <div class="sliderBar"
                               [ngClass]="appendSliderBarClass(stock['pgr_factors_rating']['technical'])"
                               role="progressbar" aria-valuemin="0" aria-valuemax="100">
                          </div>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div class="row sliderBar-container">
                        <div class="col-6 pgr__label">
                          <p>Price to Sales</p>
                        </div>
                        <div class="col-5 sliderProgress">
                          <div [ngClass]="appendSliderClass(stock['pgr_factors_rating']['expert'])"></div>
                          <div class="sliderBar"
                               [ngClass]="appendSliderBarClass(stock['pgr_factors_rating']['expert'])"
                               role="progressbar" aria-valuemin="0" aria-valuemax="100">
                          </div>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div class="row sliderBar-container">
                        <div class="col-6 pgr__label">
                          <p>Free Cash Flow</p>
                        </div>
                        <div class="col-5 sliderProgress">
                          <div [ngClass]="appendSliderClass(stock['pgr_factors_rating']['expert'])"></div>
                          <div class="sliderBar"
                               [ngClass]="appendSliderBarClass(stock['pgr_factors_rating']['expert'])"
                               role="progressbar" aria-valuemin="0" aria-valuemax="100">
                          </div>
                        </div>
                      </div>
                    </li>
                </ul> -->
          </div>
          <div class="col-12">
            <div class="divider__long"></div>
          </div>

          <div class="col-12 copy-block">
            <p class="paragraph">Price/volume activity for <span>AMZN</span> is Very Bullish. AMZN is currently strong relative to its long-term trend and has outperformed the S&P 500 over the past 6 months.</p>
            <p class="paragraph">The factor rank is based on the stock having price strength versus the market, strong Chaikin Money Flow persistency, strength vs. its long-term price trend, positive trend momentum, and an increasing volume trend.</p>
          </div>

          <div class="col-12 stock-info">
            <div class="row data-table">
              <div class="col-6 col-sm-3">
                <table>
                  <th colspan="2">Price Hi/Lo</th>
                  <tr>
                    <td class="label">52 wk high</td>
                    <td class="data">289.54</td>
                  </tr>
                  <tr>
                    <td class="label">52 wk low</td>
                    <td class="data">180.36</td>
                  </tr>
                </table>
              </div>
              <div class="col-6 col-sm-3">
                <table>
                  <th colspan="2">Price % Chg</th>
                  <tr>
                    <td class="label">% chg 4 wk rel S&amp;P</td>
                    <td class="data">11.58%</td>
                  <tr>
                    <td class="label">% chg 24 wk rel S&amp;P</td>
                    <td class="data">27.45%</td>
                  </tr>
                </table>
              </div>
              <div class="col-6 col-sm-3">
                <table>
                  <th colspan="2">Volume Activity</th>
                  <tr>
                    <td class="label">Price/Earnings</td>
                    <td class="data">18.40</td>
                  </tr>
                  <tr>
                    <td class="label">PEG</td>
                    <td class="data">1.69</td>
                  </tr>
                </table>
              </div>
              <div class="col-6 col-sm-3">
                <table>
                  <th colspan="2">Volatility Rel to Mkt</th>
                  <tr>
                    <td class="label">Dividends per Share</td>
                    <td class="data">0.68</td>
                  </tr>
                  <tr>
                    <td class="label">Payout</td>
                    <td class="data">$0.29</td>
                  </tr>
                </table>
              </div>
            </div>
          </div>

          <div class="col-12 expand-collapse">
            <img src="./assets/imgs/icon_chevron--up.svg">
            <p>COLLAPSE</p>
          </div>
          <div class="col-12">
            <div class="divider__long divider__long--red"></div>
          </div>  
        </div>

      <!-- BREAKDOWN - EXPERTS -->  
        <div class="row stock-info stock-info--breakdown">
          <div class="col-12">
            <h1>Experts: <span class="red">Bearish</span></h1>
          </div>

          <div class="col-12 stockview__PGR">
            <!--    <ul *ngIf="stock" class="pgr__sliders">
                    <li>
                      <div class="row sliderBar-container">
                        <div class="col-6 pgr__label">
                          <p>LT Debt to Equity</p>
                        </div>
                        <div class="col-5 sliderProgress">
                          <div [ngClass]="appendSliderClass(stock['pgr_factors_rating']['financial'])"></div>
                          <div class="sliderBar"
                               [ngClass]="appendSliderBarClass(stock['pgr_factors_rating']['financial'])"
                               role="progressbar" aria-valuemin="0" aria-valuemax="100">
                          </div>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div class="row sliderBar-container">
                        <div class="col-6 pgr__label">
                          <p>Price to Book</p>
                        </div>                    
                        <div class="col-5 sliderProgress">
                          <div [ngClass]="appendSliderClass(stock['pgr_factors_rating']['earning'])"></div>
                          <div class="sliderBar"
                               [ngClass]="appendSliderBarClass(stock['pgr_factors_rating']['earning'])"
                               role="progressbar" aria-valuemin="0" aria-valuemax="100">
                          </div>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div class="row sliderBar-container">
                      <div class="col-6 pgr__label">
                          <p>Return on Equity</p>
                        </div>
                        <div class="col-5 sliderProgress">
                          <div [ngClass]="appendSliderClass(stock['pgr_factors_rating']['technical'])"></div>
                          <div class="sliderBar"
                               [ngClass]="appendSliderBarClass(stock['pgr_factors_rating']['technical'])"
                               role="progressbar" aria-valuemin="0" aria-valuemax="100">
                          </div>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div class="row sliderBar-container">
                        <div class="col-6 pgr__label">
                          <p>Price to Sales</p>
                        </div>
                        <div class="col-5 sliderProgress">
                          <div [ngClass]="appendSliderClass(stock['pgr_factors_rating']['expert'])"></div>
                          <div class="sliderBar"
                               [ngClass]="appendSliderBarClass(stock['pgr_factors_rating']['expert'])"
                               role="progressbar" aria-valuemin="0" aria-valuemax="100">
                          </div>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div class="row sliderBar-container">
                        <div class="col-6 pgr__label">
                          <p>Free Cash Flow</p>
                        </div>
                        <div class="col-5 sliderProgress">
                          <div [ngClass]="appendSliderClass(stock['pgr_factors_rating']['expert'])"></div>
                          <div class="sliderBar"
                               [ngClass]="appendSliderBarClass(stock['pgr_factors_rating']['expert'])"
                               role="progressbar" aria-valuemin="0" aria-valuemax="100">
                          </div>
                        </div>
                      </div>
                    </li>
                </ul> -->
          </div>
          <div class="col-12">
            <div class="divider__long"></div>
          </div>

          <div class="col-12 copy-block">
            <p class="paragraph">Expert activity about <span>AMZN</span> is very negative. Analysts have been lowering their earnings estimates for AMZN and insiders are not net buyers of AMZN's stock.</p>
            <p class="paragraph">The factor rank is based on the stock having analysts revising earnings estimates downward, insiders not purchasing significant amounts of stock, and weak performance of the industry group, but a low short interest ratio, and optimistic analyst opinions.</p>
          </div>

          <div class="col-12">
            <div class="row data-table">
              <div class="col-12 col-sm-6">
                <table>
                  <th colspan="4">Earnings Estimate Revisions</th>
                  <tr>
                    <td class="label"></td>
                    <td class="label text-center">Current</td>
                    <td class="label text-center">7d Ago</td>
                    <td class="label text-center">% change</td>
                  </tr>
                  <tr>
                    <td class="label text-left">Current Quarter</td>
                    <td class="data text-center">0.69</td>
                    <td class="data text-center">0.69</td>
                    <td class="data text-center">0.00%</td>
                  </tr>
                  <tr>
                    <td class="label text-left">Next Quarter</td>
                    <td class="data text-center">0.68</td>
                    <td class="data text-center">0.68</td>
                    <td class="data text-center">0.00%</td>
                  </tr>
                </table>
              </div>
              <div class="col-5 col-sm-3">
                <table class="table--short-interest">
                  <th colspan="1">Short Interest</th>
                  <tr>
                    <td class="greyed-out">HIGH</td>
                  </tr>
                  <tr>
                    <td class="greyed-out">MED</td>
                  </tr>
                  <tr>
                    <td class="red">LOW</td>
                  </tr>
                </table>
              </div>
              <div class="col-7 col-sm-3">
                <table>
                  <th colspan="2">Recommendations</th>
                  <tr>
                    <td class="label">This week</td>
                    <td class="data">BUY</td>
                  </tr>
                  <tr>
                    <td class="label">Last Week</td>
                    <td class="data">BUY</td>
                  </tr>
                  <tr>
                    <td class="label">5 Weeks Ago</td>
                    <td class="data">HOLD</td>
                  </tr>
                </table>
              </div>
            </div>
          </div>

          <div class="col-12 expand-collapse">
            <img src="./assets/imgs/icon_chevron--down.svg">
            <p>EXPAND</p>
          </div>

          <div class="col-12">
            <div class="divider__long divider__long--red"></div>
          </div> 
        </div>

        <div class="row stock-info stock-info--competition">
          <div class="col-12">
            <h2>The Competition</h2>
          </div>

          <div class="col-12 chart-list">
            <h4>Growth Comparison</h4>
            <div class="divider"></div>
            <ul>
              <li class="row no-gutters col-headers">
                <div class="col-3">
                  <p>TICKER</p>
                </div>
                <div class="col-3">
                  <p>HIST EPS</p>
                </div>
                <div class="col-3">
                  <p>PROJ EPS</p>
                </div>
                <div class="col-3">
                  <p>PROFIT MRG</p>
                </div>
              </li>
              <li class="row no-gutters">
                <div class="col-3 ticker">
                  <p><span><img src="./assets/imgs/arc_Bullish.svg"></span> PGR</p>
                </div>
                <div class="col-3 data">
                  <p>7.60%</p>
                </div>
                <div class="col-3 data">
                  <p>3.12%</p>
                </div>
                <div class="col-3 data">
                  <p>3.12%</p>
                </div>
              </li>
              <li class="row no-gutters">
                <div class="col-3 ticker">
                  <p><span><img src="./assets/imgs/arc_VeryBearish.svg"></span> KPMG</p>
                </div>
                <div class="col-3 data">
                  <p>7.60%</p>
                </div>
                <div class="col-3 data">
                  <p>3.12%</p>
                </div>
                <div class="col-3 data">
                  <p>3.12%</p>
                </div>
              </li>
              <li class="row no-gutters">
                <div class="col-3 ticker">
                  <p><span><img src="./assets/imgs/arc_Bearish.svg"></span> URBN</p>
                </div>
                <div class="col-3 data">
                  <p>7.60%</p>
                </div>
                <div class="col-3 data">
                  <p>3.12%</p>
                </div>
                <div class="col-3 data">
                  <p>3.12%</p>
                </div>
              </li>
            </ul>
          </div>

          <div class="col-12 chart-list">
            <h4>Revenue Compairson</h4>
            <div class="divider"></div>
            <ul>
              <li class="row no-gutters col-headers">
                <div class="col-3">
                  <p>TICKER</p>
                </div>
                <div class="col-3">
                  <p>PEG</p>
                </div>
                <div class="col-3">
                  <p>PE</p>
                </div>
                <div class="col-3">
                  <p>REVENUE</p>
                </div>
              </li>
              <li class="row no-gutters">
                <div class="col-3 ticker">
                  <p><span><img src="./assets/imgs/arc_VeryBearish.svg"></span> KPMG</p>
                </div>
                <div class="col-3 data">
                  <p>2.02</p>
                </div>
                <div class="col-3 data">
                  <p>20.20</p>
                </div>
                <div class="col-3 data">
                  <p class="">80.430</p>
                </div>
              </li>
              <li class="row no-gutters">
                <div class="col-3 ticker">
                  <p><span><img src="./assets/imgs/arc_VeryBearish.svg"></span> KPMG</p>
                </div>
                <div class="col-3 data">
                  <p>2.02</p>
                </div>
                <div class="col-3 data">
                  <p>20.20</p>
                </div>
                <div class="col-3 data">
                  <p class="">80.430</p>
                </div>
              </li>
              <li class="row no-gutters">
                <div class="col-3 ticker">
                  <p><span><img src="./assets/imgs/arc_VeryBearish.svg"></span> KPMG</p>
                </div>
                <div class="col-3 data">
                  <p>2.02</p>
                </div>
                <div class="col-3 data">
                  <p>20.20</p>
                </div>
                <div class="col-3 data">
                  <p>80.430</p>
                </div>
              </li>
            </ul>
          </div>
          <div class="col-12">
            <div class="divider__long divider__long--red"></div>
          </div> 
        </div>

      <!-- COMPANY PROFILE -->
        <div class="row stock-info stock-info--profile">
          <div class="col-12">
            <h2>Company Profile</h2>
          </div>

          <div class="col-12 copy-block">
            <p class="paragraph"><span>AMZN's</span> earnings performance has been strong. The company has a history of strong earnings growth and has outperformed analysts' earnings estimates.</p>
            <p class="paragraph">The factor rank is based on the stock having high earnings growth over the past 3-5 years, better than expected earnings in recent quarters, and consistent earnings over the past 5 years, but a relatively poor yearly earnings trend, and a relatively high projected P/E ratio.</p>
          </div>
        </div>
      </div>

  `
  `,
  styleUrls: ['./stock-report.component.scss']
})
export class StockReportComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
