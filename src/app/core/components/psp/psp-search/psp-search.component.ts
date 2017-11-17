import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'cpt-psp-search',
  template: `
    <div (click)="toggleSearch();" class="header__button header__button--right">
      <img src="assets/imgs/icon_psp_search.svg">
    </div>
  `,
  styleUrls: ['./psp-search.component.scss']
})
export class PspSearchComponent implements OnInit {
  @Output('toggleSearchClicked') toggleSearchClicked: EventEmitter<boolean> = new EventEmitter<boolean>();

  public searchOpen: boolean = true;

  constructor() { }

  ngOnInit() {
  }

  toggleSearch() {
    console.log('toggleSearch', this.searchOpen);
    this.toggleSearchClicked.emit(this.searchOpen);
    this.searchOpen = !this.searchOpen;
  }

}
