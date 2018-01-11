import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {BaseSymbolSearchComponent} from '../../../shared/components/symbol-search/symbol-search.component';
import {Router} from '@angular/router';
import {FormControl} from '@angular/forms';

import {AuthService} from '../../../services/auth.service';
import {IdeasService} from '../../../services/ideas.service';
import {SymbolSearchService} from '../../../services/symbol-search.service';
import {Subscription} from 'rxjs/Subscription';
import {Subject} from 'rxjs/Subject';

@Component({
  selector: 'cpt-widget-search',
  template: `
    <form class="form-inline" (submit)="onSubmit(symbolSearchForm.value)">
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
      <ul *ngFor="let result of searchResults" class="container">
        <li (click)="onClick(result.Symbol)" class="row no-gutters search__entry"
            [ngClass]="{'search--match': result.Symbol == symbolSearchForm.value.toUpperCase() }">
          <div class="col-3 search__company">
            <p class="company-ticker">
              {{ result.Symbol }}
            </p>
          </div>
          <div class="col-8">
            <p class="company-name">
              {{ result.CompanyName }}
            </p>
          </div>
        </li>
      </ul>
      <ul *ngIf="searchResults && symbolSearchForm.value && searchResults.length == 0">
        <li>
          <p class="search__none">Symbol not found</p>
        </li>
      </ul>
    </div>
  `,
  styleUrls: ['./widget-search.component.scss']
})
export class WidgetSearchComponent implements OnInit {

  @Input('placeholder') placeholder: string;
  @ViewChild('search') search: ElementRef;
  @Output('focused') focused: EventEmitter<boolean> = new EventEmitter<boolean>();

  public ngUnsubscribe: Subject<void> = new Subject<void>();

  public symbolSearchForm: FormControl;
  public searchResults: Array<any>;
  public focus: boolean = false;
  public loading: Subscription;

  constructor(private symbolSearchService: SymbolSearchService) {
    this.symbolSearchForm = new FormControl();
  }

  ngOnInit() {
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

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  toggleFocus() {
    this.focus = !this.focus;
    this.focused.emit(this.focus);
  }

  onClick() {
    console.log('clicked');
  }

  onSubmit(args) {
    console.log('args', args);
  }

}
