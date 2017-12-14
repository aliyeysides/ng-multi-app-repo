// https://blog.zingchart.com/2016/08/18/angular-2-charts-with-rc5-2/

import {Component, NgZone, AfterViewInit, OnDestroy, OnChanges, SimpleChanges} from '@angular/core';
import {Chart} from '../../models/chart';

declare var zingchart: any;

@Component({
  selector: 'cpt-chaikin-chart',
  inputs: ['chart'],
  template: `
    <div id="{{chart.id}}"></div>`
})
export class ChaikinChart implements AfterViewInit, OnDestroy, OnChanges {
  chart: Chart;

  constructor(private zone: NgZone) {
  }

  ngAfterViewInit() {
    this.zone.runOutsideAngular(() => zingchart.render(this.chart));
  }

  ngOnDestroy() {
    zingchart.exec(this.chart.id, 'destroy');
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('changes', changes);
    if (changes['chart']) {
      this.chart = changes['chart']['currentValue'];
      this.zone.runOutsideAngular(() => zingchart.render(this.chart));
    }
  }
}
