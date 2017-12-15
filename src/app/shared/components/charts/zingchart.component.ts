// https://blog.zingchart.com/2016/08/18/angular-2-charts-with-rc5-2/

import {Component, NgZone, AfterViewInit, OnDestroy, OnChanges, SimpleChanges} from '@angular/core';
import {ZingChart} from '../../models/zingchart';

declare var zingchart: any;

@Component({
  selector: 'cpt-zingchart',
  inputs: ['chart'],
  template: `
    <div id="{{chart.id}}"></div>`
})
export class ChaikinChart implements AfterViewInit, OnDestroy, OnChanges {
  chart: ZingChart;

  constructor(private zone: NgZone) {
  }

  ngAfterViewInit() {
    this.zone.runOutsideAngular(() => zingchart.render(this.chart));
  }

  ngOnDestroy() {
    zingchart.exec(this.chart.id, 'destroy');
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['chart']) {
      this.chart = changes['chart']['currentValue'];
      this.zone.runOutsideAngular(() => zingchart.render(this.chart));
    }
  }
}