import {
  AfterContentInit, Component, ElementRef, EventEmitter, Input, OnDestroy, Output, ViewChild,
  ViewEncapsulation
} from '@angular/core';

import {FormControl} from '@angular/forms';
import {Router} from '@angular/router';
import {SymbolSearchService} from '../../../../services/symbol-search.service';
import {IdeasService} from '../../../../services/ideas.service';
import {AuthService} from '../../../../services/auth.service';
import {Subscription} from 'rxjs/Subscription';
import {BaseSymbolSearchComponent} from '../symbol-search.component';
import {HealthCheckService} from '../../../../services/health-check.service';
import {ListSymbolObj} from '../../../models/health-check';

declare let gtag: Function;

@Component({
  selector: 'cpt-psp-symbol-search',
  template: `
    <form class="form-inline" (submit)="onSubmit()">
      <div class="form-group">
        <input #search (focusout)="toggleFocus()" (focus)="toggleFocus()" [formControl]="symbolSearchForm" type="search"
               class="form-control search-box"
               placeholder="{{ placeholder }}"
               aria-describedby="basic-addon1">
        <button type="submit"><i (click)="search.focus()" class="fa fa-search" aria-hidden="true"></i></button>
      </div>
    </form>
    <div (mousedown)="$event.preventDefault();" *ngIf="searchResults && symbolSearchForm.value && focus == true"
         class="search__dropdown">
      <ul [ngBusy]="loading" *ngFor="let result of searchResults" class="container">
        <li (click)="onClick(result.Symbol)" class="row search__entry"
            [ngClass]="{'search--match': result.Symbol == symbolSearchForm.value.toUpperCase() }">
          <div class="col-3 search__company">
            <p class="company-ticker">
              {{ result.Symbol }}
            </p>
          </div>
          <div class="col-7">
            <p class="company-name">
              {{ result.CompanyName }}
            </p>
          </div>
          <div (click)="addToList(result.Symbol);$event.stopPropagation()" class="col-1 search__action">
            <img class="align-middle" src="./assets/imgs/icon_plus--white.svg">
          </div>
          <!--<div *ngIf="resultInUserList(result.Symbol)" (click)="addToList(result.Symbol);$event.stopPropagation()" class="col-1 search__action">-->
            <!--<img class="align-middle" src="./assets/imgs/icon_plus_minus.svg">-->
          <!--</div>-->
        </li>
      </ul>
      <ul *ngIf="searchResults && symbolSearchForm.value && searchResults.length == 0">
        <li>
          <p class="search__none">Symbol not found</p>
        </li>
      </ul>
    </div>
  `,
  styleUrls: ['./psp-symbol-search.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PspSymbolSearchComponent extends BaseSymbolSearchComponent implements AfterContentInit, OnDestroy {
  @Input('placeholder') placeholder: string;
  @ViewChild('search') search: ElementRef;
  @Output('focused') focused: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output('addToListClicked') addToListClicked: EventEmitter<boolean> =  new EventEmitter<boolean>();

  private _listId: string;
  private _uid: string;

  public symbolSearchForm: FormControl;
  public searchResults: Array<any>;
  public userStocks: ListSymbolObj[];

  public loading: Subscription;

  constructor(public router: Router,
              public authService: AuthService,
              public ideasService: IdeasService,
              public symbolSearchService: SymbolSearchService,
              private healthCheck: HealthCheckService) {
    super(router, authService, ideasService, symbolSearchService);
    this.symbolSearchForm = new FormControl();
  }

  ngOnInit() {
    this.loading = this.authService.currentUser$
      .map(usr => this._uid = usr['UID'])
      .switchMap(uid => this.healthCheck.getAuthorizedLists(uid))
      .map(res => this._listId = res[0]['User Lists'][0]['list_id'])
      .switchMap(listId => {
        return this.healthCheck.getListSymbols(listId, this._uid)
      })
      .take(1)
      .subscribe(res => {
        this.userStocks = res['symbols'];
      })
  }

  ngAfterContentInit() {
    this.search.nativeElement.focus();
    this.searchResults = [];
    this.symbolSearchForm.valueChanges
      .debounceTime(500)
      .switchMap(val => this.symbolSearchService.symbolLookup(val))
      .takeUntil(this.ngUnsubscribe)
      .subscribe(val => {
        this.searchResults = val;
      });
  }

  onSubmit() {
    // TODO: on submit
  }

  addToList(ticker: string) {
    this.ideasService.addStockIntoList(this._listId.toString(), ticker)
      .take(1)
      .subscribe(res => {
        this.healthCheck.updateMyStocksList();
        this.addToListClicked.emit();

      });
  }

  removeStock(ticker: string) {
    this.ideasService.deleteSymbolFromList(this._listId, ticker)
      .take(1)
      .subscribe(res => {
        this.healthCheck.updateMyStocksList();
        this.addToListClicked.emit();

      });
  }


  onClick() {
    console.log('clicked');
  }

  // resultInUserList(result: string) {
  //   return this.userStocks.filter(x => x['Symbol'] == result).length > 0;
  // }

}
