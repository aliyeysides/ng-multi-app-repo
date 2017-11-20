import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'cpt-psp-search',
  template: `
    <div (click)="toggleSearch()" class="header__button header__button--right">
      <img src="assets/imgs/icon_psp_search.svg">
    </div>
  `,
  styleUrls: ['./psp-search.component.scss']
})
export class PspSearchComponent implements OnInit {
  @Output('toggleSearchClicked') toggleSearchClicked: EventEmitter<void> = new EventEmitter<void>();

  constructor() {
  }

  ngOnInit() {
  }

  toggleSearch() {
    this.toggleSearchClicked.emit();
  }

}
