import {AfterViewInit, Component, Input, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import {Subject} from 'rxjs/Subject';
import {Idea, IdeaList} from '../../../shared/models/idea';
import {SignalService} from "app/core/services/signal.service";
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {IdeasService} from '../../../core/services/ideas.service';

@Component({
  selector: 'cpt-list-view',
  templateUrl: './list-view.component.html',
  styleUrls: ['./list-view.component.scss'],
})

export class ListViewComponent implements AfterViewInit, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  @Input('currentList')
  set currentList(list: IdeaList) {
    this._currentList.next(list);
  }

  get currentList() {
    return this._currentList.getValue();
  }

  @Input('uid')
  set uid(uid: string) {
    this._uid.next(uid);
  }

  get uid() {
    return this._uid.getValue();
  }

  private _currentList: BehaviorSubject<IdeaList> = new BehaviorSubject<IdeaList>({} as IdeaList);
  private _uid: BehaviorSubject<string> = new BehaviorSubject<string>('');

  public ideaList: Array<object>;

  public additionalLists: boolean = false;
  public mouseHoverOptionsMap: object = {};
  public popupOptionsMap: object = {};
  public currentView: string = 'list-view';
  public showHeadlines: boolean = false;

  public selectedStock: Idea;
  public selectedListId: string;
  public selectedListName: string;

  public selectedStockPGR: object;
  public selectedStockChartPoints: object;
  public selectedStockSimilars: object;

  public headlines: any;
  public orderByObject: object = {};
  public loadedStockIdeas: number = 0;
  public panelViewIdeasList: Array<object>;

  public loading: Subscription;
  public headlinesLoading: Subscription;
  public symbolListLoading: Subscription;

  constructor(private router: Router,
              private signalService: SignalService,
              private ideaService: IdeasService) {
  }

  ngAfterViewInit() {
    this._currentList
      .takeUntil(this.ngUnsubscribe)
      .filter(x => x !== undefined)
      .flatMap(list => this.ideaService.getListSymbols(list['list_id'].toString(), this.uid))
      .subscribe(stocks => {
        this.clearOrderByObject();
        this.clearIdeasLists();
        this.ideaList = stocks['symbols'];
        this.assignStockData(4);
        if (this.ideaList) this.selectStock(this.ideaList[0] as Idea);
      });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public onScroll() {
    this.assignStockData(2);
  }

  public selectStock(stock: Idea) {
    this.selectedStock = stock;
    if (stock) {
      this.getSelectedStockData(stock, this.assignSelectedStock.bind(this));
      this.getSelectedStockHeadlines(stock);
    }
  }

  public getSelectedStockData(stock: Idea, callback?) {
    if (stock) {
      this.loading = this.ideaService.getStockCardData(stock.symbol)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(res => {
          return callback(res);
        });
    }
  }

  public getSelectedStockHeadlines(stock: Idea) {
    if (stock) {
      this.headlinesLoading = this.ideaService.getHeadlines(stock.symbol)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(res => {
          this.headlines = res['headlines'].filter((item, index) => index < 7);
        })
    }
  }

  public setOrderByObject(val: string, order: boolean, e: Event) {
    e.preventDefault();
    this.orderByObject['field'] = val;
    this.orderByObject['ascending'] = order;
  }

  public assignSelectedStock(res) {
    this.selectedStockPGR = res['pgr'];
    this.selectedStockChartPoints = res['chart-points'];
    this.selectedStockSimilars = res['discovery-similars'].stocks;
  }

  public assignStockData(amount: number) {
    let loadNum = this.loadedStockIdeas + amount; // 0 + 4
    if (this.ideaList && this.loadedStockIdeas < this.ideaList.length) {
      this.ideaList.map((stock, index) => {
        if (index >= this.loadedStockIdeas && index < loadNum) {
          this.getSelectedStockData(stock as Idea, res => {
            this.clearOrderByObject();
            this.panelViewIdeasList.push(res);
            this.loadedStockIdeas++;
          })
        }
      })
    }
  }

  public toggleHoverOptions(idea) {
    if (!this.mouseHoverOptionsMap[idea.symbol] || this.mouseHoverOptionsMap[idea.symbol] == false) {
      this.mouseHoverOptionsMap[idea.symbol] = true;
      return;
    }
    this.mouseHoverOptionsMap[idea.symbol] = !this.mouseHoverOptionsMap[idea.symbol];
  }

  public toggleOptions(idea, e) {
    e.stopPropagation();
    if (!this.popupOptionsMap[idea.symbol] || this.popupOptionsMap[idea.symbol] == false) {
      this.popupOptionsMap = {};
      this.popupOptionsMap[idea.symbol] = true;
      return;
    }
    this.popupOptionsMap[idea.symbol] = !this.popupOptionsMap[idea.symbol];
    this.mouseHoverOptionsMap = {};
  }

  public toggleHeadlines() {
    this.showHeadlines = !this.showHeadlines;
  }

  public toggleListSelectionView() {
    this.additionalLists = !this.additionalLists;
    // this.listSelectionService.setIsShown(this.additionalLists);
  }

  public goToStockView(stock: (Idea | string), e) {
    e.stopPropagation();
    if (typeof stock === 'object') {
      this.router.navigate(['/report', stock.symbol]);
    }
    if (typeof stock === 'string') {
      this.router.navigate(['/report', stock]);
    }
  }

  public goToStockDiscovery(stock: (Idea | string), e: Event) {
    e.stopPropagation();
    if (typeof stock === 'object') {
      this.router.navigate(['/discovery', stock.symbol]);
    }
    if (typeof stock === 'string') {
      this.router.navigate(['/discovery', stock]);
    }
  }

  public goToHeadline(headline) {
    window.open(headline.url, '_blank');
  }

  public addToHoldingList(stock: any, e) {
    // e.stopPropagation();
    // this.sharedService.addStockIntoHoldingList(stock)
    //   .takeUntil(this.ngUnsubscribe)
    //   .subscribe(res => {
    //     console.log('res from addToList', res);
    //   });
  }

  public addToWatchingList(stock: any, e) {
    // e.stopPropagation();
    // this.sharedService.addStockIntoWatchingList(stock)
    //   .takeUntil(this.ngUnsubscribe)
    //   .subscribe(res => {
    //     console.log('res from addToList', res);
    //   });
  }

  public removeFromList(stock: any, listId: string, e) {
    // e.stopPropagation();
    // this.sharedService.deleteSymbolFromList(stock.symbol, listId)
    //   .takeUntil(this.ngUnsubscribe)
    //   .subscribe(res => {
    //     console.log('res from removeFromList', res);
    //   });
  }

  public checkIfUserList(listName) {
    return this.ideaService.checkIfUserList(listName);
  }

  public checkIfBullList(listName) {
    return this.ideaService.checkIfBullList(listName);
  }

  public checkIfBearList(listName) {
    return this.ideaService.checkIfBearList(listName);
  }

  public checkIfThemeList(listName) {
    return this.ideaService.checkIfThemeList(listName);
  }

  public gotoPanelView() {
    this.currentView = 'panel-view';
  }

  public gotoListView() {
    this.currentView = 'list-view';
  }

  public translateIndustryStrength(listRating: number): string {
    return listRating >= 50 ? 'Strong' : 'Weak';
  }

  public appendPGRImage(pgr) {
    return this.signalService.appendPGRImage(pgr);
  }

  public appendPGRText(pgr) {
    return this.signalService.appendPGRText(pgr);
  }

  public appendPGRClass(pgr) {
    return this.signalService.appendPGRClass(pgr);
  }

  public appendSliderClass(pgr) {
    return this.signalService.appendSliderClass(pgr);
  }

  public appendSliderBarClass(pgr) {
    return this.signalService.appendSliderBarClass(pgr);
  }

  private clearOrderByObject() {
    this.orderByObject = {};
  }

  private clearIdeasLists() {
    this.loadedStockIdeas = 0;
    this.panelViewIdeasList = [];
    this.ideaList = [];
  }

}
