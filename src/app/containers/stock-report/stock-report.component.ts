import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'cpt-stock-report',
  template: `
    <div class="container stock-report">
      stock-report Works!
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
