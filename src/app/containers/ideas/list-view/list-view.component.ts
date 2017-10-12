import {AfterViewInit, Component, EventEmitter, Input, OnDestroy, Output} from '@angular/core';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import {Subject} from 'rxjs/Subject';
import {Idea, IdeaList} from '../../../shared/models/idea';
import {SignalService} from "app/core/services/signal.service";
import {IdeasService} from '../../../core/services/ideas.service';
import {AuthService} from '../../../core/services/auth.service';
import {UtilService} from '../../../core/services/util.service';

@Component({
  selector: 'cpt-list-view',
  templateUrl: './list-view.component.html',
  styleUrls: ['./list-view.component.scss'],
})

export class ListViewComponent implements AfterViewInit, OnDestroy {
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
  public loadedStockIdeas: number = 0;
  public panelViewIdeasList: Array<object>;

  public loading: Subscription;
  public headlinesLoading: Subscription;

  constructor(private router: Router,
              private authService: AuthService,
              private utilService: UtilService,
              private signalService: SignalService,
              private ideaService: IdeasService) {
  }

  ngAfterViewInit() {
    this.updateData();
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  updateData() {
    this.loading = this.authService.currentUser$
      .map(usr => this.uid = usr['UID'])
      .flatMap(uid => this.ideaService.selectedList)
      .takeUntil(this.ngUnsubscribe)
      .filter(x => x !== undefined)
      .filter(x => x['list_id'] !== undefined)
      .flatMap(list => {
        this.currentList = list;
        return this.ideaService.getListSymbols(list['list_id'].toString(), this.uid)
      })
      .subscribe(stocks => {
        this.clearOrderByObject();
        this.clearIdeasLists();
        this.ideaList = stocks['symbols'];
        this.assignStockData(4);
        if (this.ideaList) this.selectStock(this.ideaList[0] as Idea);
      });
  }

  refreshList() {
    this.symbolListLoading = this.ideaService.selectedList
      .filter(x => x !== undefined)
      .filter(x => x['list_id'] !== undefined)
      .flatMap(list => {
        this.currentList = list;
        return this.ideaService.getListSymbols(list['list_id'].toString(), this.uid)
      })
      .take(1)
      .subscribe(stocks => {
        this.clearOrderByObject();
        this.clearIdeasLists();
        this.ideaList = stocks['symbols'];
        this.assignStockData(4);
        // if (this.ideaList) this.selectStock(this.selectedStock as Idea)
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
