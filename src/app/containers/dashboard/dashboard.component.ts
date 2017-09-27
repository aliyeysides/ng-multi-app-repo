import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'cpt-dashboard',
  template: `
    <div class="container-fluid dashboard">
      <div class="row">
        <div class="col-md-8">
          <cpt-bearish-insights></cpt-bearish-insights>
          <cpt-idea-lists></cpt-idea-lists>
        </div>
        <div class="col-md-4">
          <cpt-bear-of-the-week></cpt-bear-of-the-week>
          <cpt-user-lists></cpt-user-lists>
          <cpt-best-bear-ideas></cpt-best-bear-ideas>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
