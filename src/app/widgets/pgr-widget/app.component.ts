import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {SymbolSearchService} from '../../services/symbol-search.service';
import {ReportService} from '../../services/report.service';

@Component({
  selector: 'cpt-pgr-widget-app',
  template: `
    <h1>{{ currentStock.getValue() }}</h1>
    <accordion>
      <accordion-group>
        <div accordion-heading class="clearfix">
          I can have markup, too!
          <span class="badge badge-secondary float-right pull-right">Some HTML here</span>
        </div>
      </accordion-group>
      <accordion-group #group>
        <div accordion-heading class="clearfix">
          I can have markup, too!
          <span class="badge badge-secondary float-right pull-right">Some HTML here</span>
        </div>
        This is just some content to illustrate fancy headings.
      </accordion-group>
      <accordion-group heading="Group with isOpenChange event listener" (isOpenChange)="log($event)">
        <p>Some content</p>
        <div accordion-heading class="clearfix">
          I can have markup, too!
          <span class="badge badge-secondary float-right pull-right">Some HTML here</span>
        </div>
      </accordion-group>
      <accordion-group heading="Another group">
        <p>Some content</p>
        <div accordion-heading class="clearfix">
          I can have markup, too!
          <span class="badge badge-secondary float-right pull-right">Some HTML here</span>
        </div>
      </accordion-group>
    </accordion>
  `,
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {

  currentStock: BehaviorSubject<string> = new BehaviorSubject<string>('AAPL');
  is_etf: boolean;
  symbolData;
  research;

  constructor(private symbolSearchService: SymbolSearchService,
              private reportService: ReportService,
              private cd: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.currentStock.subscribe(stock => {
      this.symbolSearchService.symbolLookup(stock)
        .take(1)
        .subscribe(val => {
          val[0] ? this.is_etf = val[0]['is_etf'] : this.is_etf = true;
          if (!this.is_etf) {
            this.getReportData(stock);
          }
          this.cd.detectChanges();
        });
    })
  }

  getReportData(stock: string) {
    this.reportService.getSymbolData(stock)
      .take(1)
      .filter(x => x != undefined)
      .map(res => {
        this.symbolData = res;
        console.log('symbolData', this.symbolData);
        this.cd.markForCheck();
      })
      .switchMap(() => this.reportService.getResearchReportData(stock))
      .take(1)
      .subscribe(research => {
        this.research = research;
        console.log('research', this.research);
        this.cd.markForCheck();
      });
  }

}
