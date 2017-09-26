import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'cpt-bear-of-the-week',
  template: `
    <p>
      bear-of-the-week Works!
    </p>
  `,
  styleUrls: ['./bear-of-the-week.component.scss']
})
export class BearOfTheWeekComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
