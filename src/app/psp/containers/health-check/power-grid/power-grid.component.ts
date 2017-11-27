import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'cpt-psp-power-grid',
  template: `
    <div class="col-12 col-md-7 col-lg-8 section section--powergrid">

      <div class="row">
        <div class="col-12">
          <h2>Power Grid</h2>
        </div>
      </div>

      <div class="row">
        <div class="col-12 chart__header">
          <h3 class="green">Strong Industries</h3>
          <div class="divider__long divider__long--green"></div>
        </div>

        <div class="col-12 powerGrid">
          <div class="row col-headers">
            <div class="col-6">
              <p>Strong Stocks</p>
            </div>
            <div class="col-6">
            </div>
          </div>
          <div class="row grid__row">
            <div class="col-6 grid__quadrant green">
              <p class="ticker"><a>BMW</a>, <a>AUDI</a></p>
              <p class="ticker"><a>JASO</a></p>
            </div>
            <div class="col-6 grid__quadrant">
              <p class="industry green">Automotive</p>
              <p class="industry green">Energy</p>
            </div>
          </div>
        </div>

        <div class="col-12 powerGrid">
          <div class="row col-headers">
            <div class="col-6">
              <p>Weak Stocks</p>
            </div>
            <div class="col-6">
            </div>
          </div>
          <div class="row grid__row">
            <div class="col-6 grid__quadrant red">
              <p class="ticker">DSNY</p>
            </div>
            <div class="col-6 grid__quadrant">
              <p class="industry green">Entertainment-Media</p>
            </div>
          </div>
        </div>

        <div class="col-12 chart__header">
          <h3 class="red">Weak Industries</h3>
          <div class="divider__long divider__long--red"></div>
        </div>

        <div class="col-12 powerGrid">
          <div class="row col-headers">
            <div class="col-6">
              <p>Strong Stocks</p>
            </div>
            <div class="col-6">
            </div>
          </div>
          <div class="row grid__row">
            <div class="col-6 grid__quadrant green">
              <p class="ticker"></p>
            </div>
            <div class="col-6 grid__quadrant">
            </div>
          </div>
        </div>

        <div class="col-12 powerGrid">
          <div class="row col-headers">
            <div class="col-6">
              <p>Weak Stocks</p>
            </div>
            <div class="col-6">
            </div>
          </div>
          <div class="row grid__row">
            <div class="col-6 grid__quadrant red">
              <p class="ticker"><a>BMW</a>, <a>AUDI</a>, <a>TSLA</a>, <a>AUDI</a></p>
              <p class="ticker"><a>JASO</a></p>
              <p class="ticker"><a>JASO</a></p>
            </div>
            <div class="col-6 grid__quadrant">
              <p class="industry red">Automotive</p>
              <p class="industry red">Energy</p>
              <p class="industry red">Energy</p>
            </div>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-12 expand-collapse">
          <img src="./assets/imgs/icon_chevron--up.svg">
          <p>COLLAPSE</p>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['../health-check.component.scss']
})
export class PowerGridComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
