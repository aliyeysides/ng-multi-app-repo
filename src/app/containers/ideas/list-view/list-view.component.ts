import {Component, EventEmitter, Input, OnDestroy, Output, HostListener, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import {Subject} from 'rxjs/Subject';
import {Idea, IdeaList} from '../../../shared/models/idea';
import {SignalService} from "app/core/services/signal.service";
import {IdeasService} from '../../../core/services/ideas.service';
import {AuthService} from '../../../core/services/auth.service';
import {UtilService} from '../../../core/services/util.service';

import * as moment from 'moment';
import {Observable} from 'rxjs/Observable';

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
  // public loadStockIdeasFromIndex = 0;
  public panelViewIdeasList: Array<object> = [];

  public loading: Subscription;
  public headlinesLoading: Subscription;
  public panelLoading: Subscription;

  public chartData: object = null;

  constructor(private router: Router,
              private authService: AuthService,
              private utilService: UtilService,
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
        if (this.ideaList) this.selectStock(this.ideaList[0] as Idea);
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
        this.assignStockData(alreadyLoaded);
        const selectedStock = this.ideaList.filter(idea => idea['symbol'] === this.selectedStock['symbol'])[0];
        this.selectStock(selectedStock as Idea);
      });
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
    const panelView = document.getElementsByClassName('view-option--panel')[0];
    if (panelView) panelView.scrollTo(0, 0);
    this.orderByObject['field'] = val;
    this.orderByObject['ascending'] = order;
  }

  public assignSelectedStock(res) {
    this.selectedStockPGR = res['pgr'];
    this.selectedStockChartPoints = res['chart-points'];
    this.selectedStockSimilars = res['discovery-similars'].stocks;


    let data = {
      "yAxisData": {
        "lineData": (this.selectedStockChartPoints['dema']).reverse(),
        "rectData": (this.selectedStockChartPoints['pgr']).reverse(),
        "areaData": (this.selectedStockChartPoints['closePrice']).reverse()
      },
      "xAxisData": (this.selectedStockChartPoints['dates']).reverse(),
      "xAxisFormatedData": (this.selectedStockChartPoints['dates'])
    };
    for (let i = 0; i < data.xAxisData.length; i++) {
      data.yAxisData.lineData[i] = parseFloat(data.yAxisData.lineData[i]);
      data.yAxisData.rectData[i] = parseInt(data.yAxisData.rectData[i]);
      data.yAxisData.areaData[i] = parseFloat(data.yAxisData.areaData[i]);
    }

    data.xAxisFormatedData = data.xAxisFormatedData.map(res => moment(res).format('MMM DD YYYY'));

    this.chartData = data;
    this.drawchart();

  }

  public drawchart() {
    if (this.chartData != null) {
      this.ideaService.areaChartWithBrushing.init({data: this.chartData, id: 'area-chart'});
    }
  }

  public assignStockData(amount: number) {
    this.clearOrderByObject();
    let startingIndex = this.panelViewIdeasList.length;
    if (this.ideaList && this.panelViewIdeasList.length < this.ideaList.length) {
      const listOfStocksToLoad = this.ideaList.slice(startingIndex,this.ideaList.length).filter((stock, index) => { if (amount > index) return stock });
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

}
