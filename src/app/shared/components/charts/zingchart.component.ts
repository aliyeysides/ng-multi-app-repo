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
      zingchart.bind('mainChart', 'label_click', function(e){
        console.log('test');
        if(this.stockState.current === e.labelid){
          return;
        }

        var windowClose = [];
        var windowVolume = [];
        var windowDates = [];
        var cut = 0;
        switch(e.labelid) {
          case '1W':
            cut = 5;
            break;
          case '1M':
            cut = 20;
            break;
          case '6M':
            cut = 130;
            break;
          case '1Y':
            cut = 260;
            break;
          default:
            cut = this.stockState.dates.length;
            break;
        }
        windowClose = this.stockState.closes.slice(this.stockState.closes.length-cut);
        windowDates = this.stockState.dates.slice(this.stockState.dates.length-cut);
        windowVolume = this.stockState.volumes.slice(this.stockState.rsi.length-cut);

        zingchart.exec('myChart', 'setdata', {

          data: {
            graphset:[
              this.getCloseConfig(windowDates, windowClose, e.labelid),
              this.getRSIConfig(windowDates, windowVolume)
            ]
          }
        });

        this.stockState.current = e.labelid;

      });
    });
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
