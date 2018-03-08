import {
  AfterContentInit, ElementRef, EventEmitter, Input, OnDestroy, Output, ViewChild,
} from '@angular/core';

import {FormControl} from '@angular/forms';
import {NavigationEnd, Router} from '@angular/router';
import {Subject} from 'rxjs/Subject';
import {SymbolSearchService} from '../../../services/symbol-search.service';
import {IdeasService} from '../../../services/ideas.service';
import {AuthService} from '../../../services/auth.service';
import {Subscription} from 'rxjs/Subscription';

declare let gtag: Function;

export class BaseSymbolSearchComponent implements AfterContentInit, OnDestroy {
  @Input('placeholder') placeholder: string;
  @Input('defaultFocus') focus: boolean;
  @ViewChild('search') search: ElementRef;
  @Output('focused') focused: EventEmitter<boolean> = new EventEmitter<boolean>();

  public ngUnsubscribe: Subject<void> = new Subject<void>();
  public navEndLocation: string;

  public symbolSearchForm: FormControl;
  public searchResults: Array<any>;
  public loading: Subscription;

  constructor(public authService: AuthService,
              public ideasService: IdeasService,
              public symbolSearchService: SymbolSearchService,
              public router: Router) {
    this.symbolSearchForm = new FormControl();

    router.events
      .filter(e => e instanceof NavigationEnd)
      .forEach(e => this.navEndLocation = router.routerState.root.firstChild.component['name']);
  }

  ngAfterContentInit() {
    if (this.focus) this.search.nativeElement.focus();
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

}
