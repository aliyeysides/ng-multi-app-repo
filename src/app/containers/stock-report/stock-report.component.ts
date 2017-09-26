import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'cpt-stock-report',
  template: `
    <div class="container stock-report">
      <cpt-report></cpt-report>
    </div>
  `,
  styleUrls: ['./stock-report.component.scss']
})
export class StockReportComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
