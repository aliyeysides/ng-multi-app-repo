import { Component } from '@angular/core';

@Component({
  selector: 'cpt-root',
  template: `
  <h1>
    {{title}}
  </h1>
  `,
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'cpt works!';
}
