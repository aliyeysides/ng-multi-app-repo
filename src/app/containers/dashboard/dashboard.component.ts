import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'cpt-dashboard',
  template: `
    <div class="container dashboard">
      dashboard Works!
      <cpt-bearish-insights></cpt-bearish-insights>
      <cpt-idea-lists></cpt-idea-lists>
      <cpt-bear-of-the-week></cpt-bear-of-the-week>
      <cpt-user-lists></cpt-user-lists>
      <cpt-best-bear-ideas></cpt-best-bear-ideas>
    </div>
  `,
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
