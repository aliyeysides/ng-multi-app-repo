import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'cpt-dashboard',
  template: `
    <p>
      dashboard Works!
    </p>
  `,
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
