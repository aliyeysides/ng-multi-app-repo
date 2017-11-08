import { Component, EventEmitter, Input, OnDestroy, Output, HostListener, OnInit, AfterViewChecked } from '@angular/core';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import {Subject} from 'rxjs/Subject';
import {Idea, IdeaList} from '../../../../shared/models/idea';
import {SignalService} from "app/core/services/signal.service";
import {IdeasService} from '../../../../core/services/ideas.service';
import {InteractiveChart} from '../../../../core/services/chart.sevice';
import {AuthService} from '../../../../core/services/auth.service';
import {UtilService} from '../../../../core/services/util.service';

declare let gtag: Function;
import {Observable} from 'rxjs/Observable';
import {SymbolSearchService} from '../../../../core/services/symbol-search.service';

@Component({
  selector: 'cpt-list-view',
  templateUrl: './list-view.component.html',
  styleUrls: ['./list-view.component.scss'],
})

export class ListViewComponent implements OnInit, OnDestroy {
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.drawchart();
  }

  @Output('addToListClicked') addToListClicked: EventEmitter<object> = new EventEmitter<object>();
  @Output('removeFromListClicked') removeFromListClicked: EventEmitter<object> = new EventEmitter<object>();

  @Input('symbolListLoading') symbolListLoading: Subscription;

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private uid: string;

  public ideaList: Array<object>;
  public currentList: IdeaList;

  public mouseHoverOptionsMap: object = {};
  public popupOptionsMap: object = {};
  public currentView: string = 'list-view';

  public selectedStock: Idea;
  public selectedStockPGR: object;
  public selectedStockChartPoints: object;
  public selectedStockSimilars: object;

  public headlines: any;
  public orderByObject: object = {};
  public panelViewIdeasList: Array<object> = [];

  public loading: Subscription;
  public headlinesLoading: Subscription;
  public panelLoading: Subscription;

  public chartData: object = null;

  constructor(private router: Router,
              private authService: AuthService,
              private utilService: UtilService,
              private searchService: SymbolSearchService,
              private signalService: SignalService,
              private ideaService: IdeasService) {
  }

  ngOnInit() {
    this.loading = this.initDataLoad();

    setInterval(() => {
      this.refreshList()
    }, 1000 * 60)
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  initDataLoad() {
    return this.authService.currentUser$
      .map(usr => this.uid = usr['UID'])
      .flatMap(uid => this.ideaService.selectedList)
      .takeUntil(this.ngUnsubscribe)
      .filter(x => x !== undefined)
      .filter(x => x['list_id'] !== undefined)
      .flatMap(list => {
        this.currentList = list;
        this.gotoListView();
        return this.ideaService.getListSymbols(list['list_id'].toString(), this.uid)
      })
      .subscribe(stocks => {
        this.clearOrderByObject();
        this.panelViewIdeasList = [];
        this.ideaList = [];
        this.ideaList = stocks['symbols'];
        this.selectStock(this.ideaList[0] as Idea);
      });
  }

  refreshList() {
    return this.ideaService.selectedList
      .filter(x => x !== undefined)
      .filter(x => x['list_id'] !== undefined)
      .flatMap(list => {
        this.currentList = list;
        return this.ideaService.getListSymbols(list['list_id'].toString(), this.uid)
      })
      .take(1)
      .subscribe(stocks => {
        this.ideaList = stocks['symbols'];
        const alreadyLoaded = this.panelViewIdeasList.length;
        this.panelViewIdeasList = [];
        if (this.currentView == 'panel-view') this.assignStockData(alreadyLoaded);
        if (this.selectedStock) {
          const selectedStock = this.ideaList.filter(idea => idea['symbol'] === this.selectedStock['symbol'])[0];
          this.selectStock(selectedStock as Idea);
        }
      });
  }

  public onScroll() {
    this.assignStockData(2);
    gtag('event', 'panel_view_scrolled', { 'event_category': 'engagement' })
  }

  public selectStock(stock: Idea) {
    this.selectedStock = stock;
    if (stock) {
      this.getSelectedStockData(stock, this.assignSelectedStock.bind(this));
      this.getSelectedStockHeadlines(stock);
    }
  }

  public trackSelectedStock(stock: Idea) {
    gtag('event', 'stock_selected', {
      'event_category': 'engagement',
      'event_label': stock['name']
    });
  }

  public getSelectedStockData(stock: Idea, callback?) {
    if (stock) {
      this.panelLoading = this.ideaService.getStockCardData(stock.symbol)
        .filter(x => x != undefined)
        .take(1)
        .subscribe(res => {
          return callback(res);
        });
    }
  }

  public getSelectedStockHeadlines(stock: Idea) {
    if (stock) {
      this.headlinesLoading = this.ideaService.getHeadlines(stock.symbol)
        .filter(x => x != undefined)
        .take(1)
        .subscribe(res => {
          this.headlines = res['headlines'].filter((item, index) => index < 7);
        })
    }
  }

  public setOrderByObject(val: string, order: boolean, e: Event) {
    e.preventDefault();
    gtag('event', 'sort_by_clicked', { 'event_label': val });
    const panelView = document.getElementsByClassName('view-option--panel')[0];
    if (panelView) panelView.scrollTo(0, 0);
    this.orderByObject['field'] = val;
    this.orderByObject['ascending'] = order;
  }

  public assignSelectedStock(res) {
    this.selectedStockPGR = res['pgr'];
    this.selectedStockChartPoints = res['chart-points'];
    this.selectedStockSimilars = res['discovery-similars'].stocks;

    this.chartData = this.selectedStockChartPoints;
    this.drawchart();

  }

  public drawchart() {

    if (this.chartData != null && (document.getElementById('area-chart'))) {
      let chartObj = new InteractiveChart(this.chartData, 'area-chart');
      chartObj.init();
    }
  }

  public assignStockData(amount: number) {
    this.clearOrderByObject();
    let startingIndex = this.panelViewIdeasList.length;
    if (this.ideaList && this.panelViewIdeasList.length < this.ideaList.length) {
      const listOfStocksToLoad = this.ideaList.slice(startingIndex, this.ideaList.length).filter((stock, index) => {
        if (amount > index) return stock
      });
      this.panelLoading = Observable.from(listOfStocksToLoad)
        .concatMap(stock => {
          return Observable.combineLatest(
            this.ideaService.getStockCardData(stock['symbol']),
            Observable.of(stock))
        })
        .subscribe(([data, res]) => {
          Object.assign(data, res);
          this.panelViewIdeasList.push(data);
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

  public addToList(list: string, symbol: string, e: Event) {
    e.stopPropagation();
    const params = {
      list: list,
      symbol: symbol
    };
    this.addToListClicked.emit(params);
  }

  public removeFromList(list: string, symbol: string, e: Event) {
    e.stopPropagation();
    const params = {
      list: list,
      symbol: symbol
    };
    this.removeFromListClicked.emit(params);
  }

  public checkIfUserList(listName) {
    return this.utilService.checkIfUserList(listName);
  }

  public checkIfBullList(listName) {
    return this.utilService.checkIfBullList(listName);
  }

  public checkIfBearList(listName) {
    return this.utilService.checkIfBearList(listName);
  }

  public checkIfThemeList(listName) {
    return this.utilService.checkIfThemeList(listName);
  }

  public gotoPanelView() {
    this.clearOrderByObject();
    this.assignStockData(4);
    this.currentView = 'panel-view';
    gtag('event', 'panel_view_clicked', { 'event_category': 'engagement' })
  }

  public gotoListView() {
    this.panelViewIdeasList = [];
    this.currentView = 'list-view';
    this.refreshList();
  }

  public translateIndustryStrength(listRating: number): string {
    return listRating >= 50 ? 'Strong' : 'Weak';
  }

  public appendPGRImage(pgr, rawPgr) {
    return this.signalService.appendPGRImage(pgr, rawPgr);
  }

  public appendPGRText(pgr, rawPgr) {
    return this.signalService.appendPGRText(pgr, rawPgr);
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

  public clearOrderByObject() {
    this.orderByObject = {};
  }

  public openSearch() {
    this.searchService.setSearchOpen(true);
  }

}
