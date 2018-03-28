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
    this.zone.runOutsideAngular(() => {
      zingchart.render(this.chart);
    });
  }

  ngOnDestroy() {
    this.zone.runOutsideAngular(() => {
      zingchart.exec(this.chart.id, 'destroy');
    })
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['chart']) {
      const chgs = changes['chart'];
      const curr_chart_val = changes['chart']['currentValue'];
      const data = curr_chart_val['data'];

      if (data['graphset'].length > 0) {
        this.zone.runOutsideAngular(() => zingchart.render(this.chart));
      }

    }
  }
}
