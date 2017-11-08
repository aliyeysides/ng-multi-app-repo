import { Component, EventEmitter, Input, OnDestroy, Output, HostListener, OnInit, AfterViewChecked } from '@angular/core';
import { IdeasService } from '../../../../core/services/ideas.service';
import { InteractiveChart } from '../../../../core/services/chart.sevice';
import { Subscription } from 'rxjs/Subscription';
import * as d3 from 'd3';

import * as moment from 'moment';

@Component({
  selector: 'panel-chart',
  template: `<div class="panel__chart" style="width: 100%; display:block; height:100%;" [id]="appendId()" row no-gutters> </div>`,
  styleUrls: ['./list-view.component.scss'],
})


export class ChartComponent implements AfterViewChecked {
  @Input('idea') idea: Subscription;
  public chartArray: Array<object> = [];
  constructor(private ideaService: IdeasService) { }

  public ngAfterViewChecked(): void { }

  public ngAfterViewInit(): void {
    let self = this;

    let chartSymbol = this.idea['meta-info'].symbol;
    let chartObj = new InteractiveChart(self.idea['chart-points'], chartSymbol);
    chartObj.init();
  }

  public appendId() {
    return this.idea['meta-info'].symbol;
  }
}

