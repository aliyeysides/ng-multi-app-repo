import { Component, EventEmitter, Input, OnDestroy, Output, HostListener, OnInit, AfterViewChecked } from '@angular/core';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import {Subject} from 'rxjs/Subject';
import {Idea, IdeaList} from '../../../shared/models/idea';
import {SignalService} from "app/core/services/signal.service";
import {IdeasService} from '../../../core/services/ideas.service';
import {AuthService} from '../../../core/services/auth.service';
import {UtilService} from '../../../core/services/util.service';

import * as d3 from 'd3';

import * as moment from 'moment';
import {Observable} from 'rxjs/Observable';


export class InteractiveChart{
  public chartData: any;
  public id: string;
  public mainSVG: any;
  public selectorElement: any;
  public height: any;
  public width: any;
  public yMin: any;
  public yMax: any;
  public brushXScale: any;
  public brush: any;
  public xScale: any;
  public yScale: any;
  public dummyScale: any;
  public xAxis: any;
  public xAxisDummy: any;
  public yAxis: any;
  public chartWidth: any;
  public chartHeight: any;
  public scaleHeight: any;
  public scaleWidth: any;
  public pgrBarHeight: any;
  public brushHeight: any;
  public sectorHeightFactor: any;
  public margins: any;
  public areaChartMargins: any;
  public sectorMargins: any;
  public parentGroup: any;
  public dummyParentGroup: any;
  public visibleXAxis: any;
  public parentSectorGroup: any;
  public mainPGRGroup: any;
  public pgrBarChartGroup: any;
  public areaGroup: any;
  public hoverLineGroup: any;
  public noOfTicks: any;
  public tickDisplacementFactor: any;
  public palette: any;
  public description: any;


  constructor(data,chartId) {
    this.id = chartId;
    this.chartData = null;
    this.mainSVG = null;
    this.selectorElement = null;
    this.height = null;
    this.width =  null;
    this.yMin = null;
    this.yMax = null;
    this.brushXScale = null;
    this.brush =  null;
    this.xScale = null;
    this.yScale = null;
    this.dummyScale = null;
    this.xAxis = null;
    this.xAxisDummy = null;
    this.yAxis = null;
    this.chartWidth = null;
    this.chartHeight = null;
    this.scaleHeight = null;
    this.scaleWidth = null;
    this.pgrBarHeight = null;
    this.brushHeight = 5;
    this.sectorHeightFactor = 10;
    this.margins = { left: 0, top: 5, right: 30, bottom: 20 };
    this.areaChartMargins = { left: 10, right: 0, bottom: 0, top: 5 };
    this.sectorMargins = { left: 0, right: 0, bottom: 0, top: 15 };
    this.parentGroup = null;
    this.dummyParentGroup = null;
    this.visibleXAxis = null;
    this.parentSectorGroup = null;
    this.mainPGRGroup = null;
    this.pgrBarChartGroup = null;
    this.areaGroup = null;
    this.hoverLineGroup = null;
    this.noOfTicks = null;
    this.tickDisplacementFactor = 2.5;
    this.palette =  {
      "-1": "grey",
      "0": "white",
      "1": "#EB001C",
      "2": "#EB001C",
      "3": "#ffbe00",
      "4": "#24A300",
      "5": "#24A300"
    };
    this.description = {
      //new description adding for rating -1 according to specification des 18
      "-1": "NONE",
      0: "NONE",
      1: "VERY BEARISH",
      2: "BEARISH",
      3: "NEUTRAL",
      4: "BULLISH",
      5: "VERY BULLISH"

    },
    this.formatData(data)
  }
  public formatData(res){
    let chartData = res;
    let data = {
      "yAxisData": {
        "lineData": (chartData['dema']).reverse(),
        "rectData": (chartData['pgr']).reverse(),
        "areaData": (chartData['closePrice']).reverse()
      },
      "xAxisData": (chartData['dates']).reverse(),
      "xAxisFormatedData": (chartData['dates'])
    };
    for (let i = 0; i < data.xAxisData.length; i++) {
      data.yAxisData.lineData[i] = parseFloat(data.yAxisData.lineData[i]);
      data.yAxisData.rectData[i] = parseInt(data.yAxisData.rectData[i]);
      data.yAxisData.areaData[i] = parseFloat(data.yAxisData.areaData[i]);
    }
    data.xAxisFormatedData = data.xAxisFormatedData.map(res => moment(res).format('MMM DD YYYY'));
    this.chartData = data;
  }
  public init(){
    if (document.getElementById(this.id)){
      document.getElementById(this.id).innerHTML = "";
    }
    
    if (this.mainSVG == null) {
      this.margins.bottom = this.margins.bottom + this.brushHeight;
    }
    this.brush = null;
    this.selectorElement = document.getElementById(this.id);
    this.height = document.getElementById(this.id).clientHeight;
    this.width = document.getElementById(this.id).clientWidth;
    this.setupChart();
  }

  public setupChart(){

    if (this.mainSVG) {
      this.mainSVG.remove();
    }

    this.mainSVG = d3.select(`#${this.id}`).append("svg")
      .attr("preserveAspectRatio", "none")
      .attr("viewBox", "0 0 " + this.width + " " + this.height + "")
      .attr("type", "chart")

    this.parentGroup = this.mainSVG.append("g").attr("class", "parentGroup").attr("transform", "translate(" + this.margins.left + "," + this.margins.top + ")");
    this.dummyParentGroup = this.mainSVG.append("g").attr("class", "dummyGroup").attr("transform", "translate(" + (this.margins.left + this.areaChartMargins.left) + "," + (this.margins.top + this.areaChartMargins.top) + ")");
    this.visibleXAxis = this.mainSVG.append("g").attr("class", "dummyGroup").attr("transform", "translate(" + (this.margins.left + this.areaChartMargins.left) + "," + (this.margins.top + this.areaChartMargins.top) + ")");

    this.chartWidth = this.width - this.margins.left - this.margins.right;
    this.chartHeight = this.height - this.margins.top - this.margins.bottom;
    var lowerChartHeight = this.sectorHeightFactor;

    this.scaleHeight = this.chartHeight - lowerChartHeight;

    this.scaleWidth = this.chartWidth - this.areaChartMargins.left - this.areaChartMargins.right;

    this.scaleHeight = this.scaleHeight - this.areaChartMargins.top - this.areaChartMargins.bottom;

    this.parentGroup.append("g").attr("class", "area-clip-path")
      .attr("transform", "translate(" + this.areaChartMargins.left + "," + this.areaChartMargins.top + ")")
      .append("defs").append("clipPath").attr("id", "areaClip").append("rect").attr("class", "areaPathViewport").attr("width", this.scaleWidth)
      .attr("height", this.scaleHeight);

    this.dummyParentGroup.append("g").attr("class", "chart-clip-path")
      .append("defs").append("clipPath").attr("id", "chartClip").append("rect").attr("class", "areaPathViewport").attr("width", this.scaleWidth)
      .attr("height", this.chartHeight + this.areaChartMargins.bottom);

    this.areaGroup = this.parentGroup.append("g").attr("class", "areaGroup")
      .attr("transform", "translate(" + this.areaChartMargins.left + "," + this.areaChartMargins.top + ")");

    this.parentGroup.append("g").attr("class", "brush-backgroud-group").attr("transform", "translate(" + (this.areaChartMargins.left) + "," + ((this.margins.bottom / 2) + this.chartHeight) + ")")
      .append("rect").attr("class", "brush-background-rect")
      .attr("y", 3).attr("height", this.brushHeight)
      .attr("width", this.scaleWidth).attr("fill", "blue")
      .attr("opacity", 0.03);

    //Create brush for the charts
    this.parentGroup.append("g").attr("transform", "translate(" + (this.areaChartMargins.left) + "," + ((this.margins.bottom / 2) + this.chartHeight) + ")")
      .attr("class", "x brush");

    this.dummyParentGroup.append("g").attr("class", "xAxisGroup axis");
    this.visibleXAxis.append("g").attr("class", "xAxisGroupDummy axis");
    this.parentGroup.append("g").attr("class", "xAxisGroupAdvance");

    // Draw Group for y Axis in which append y Axis
    this.parentGroup.append("g").attr("class", "yAxisGroup yAxis axis");

    //Parent sector group for all other sectors.
    this.parentSectorGroup = this.parentGroup.append("g").attr("class", "parentSectorGroup")
      .attr("transform", "translate(" + this.areaChartMargins.left + "," + (this.scaleHeight + this.areaChartMargins.bottom + this.areaChartMargins.top) + ")");

    this.mainPGRGroup = this.parentSectorGroup.append("g").attr("class", "main-pgr-group")

    //actual container group for bars.
    this.pgrBarChartGroup = this.mainPGRGroup.append("g").attr("class", "pgr-bars-group")
      .attr("transform", "translate(" + (0) + "," + (0) + ")");

    this.pgrBarChartGroup.append("g").attr("class", "pgr-clip-path")
      .append("defs").append("clipPath").attr("id", "pgrClip").append("rect").attr("class", "areaPathViewport").attr("width", this.scaleWidth)
      .attr("height", this.scaleHeight);

    this.pgrBarHeight = this.chartHeight - (this.scaleHeight + this.areaChartMargins.top + this.areaChartMargins.bottom);
     
    this.updateChart();
  }

  public updateChart(){
    let chartObj = this.chartData;
    this.yMin = d3.min(this.chartData.yAxisData.lineData.concat(this.chartData.yAxisData.areaData));
    this.yMax = d3.max(this.chartData.yAxisData.lineData.concat(this.chartData.yAxisData.areaData));
    //console.log(d3.select(`#${this.id}`));
    this.mainSVG.select(`.brush-background-rect`).attr("width", this.scaleWidth);

    let maxStringLength = this.textLength(this.chartData.xAxisData);
   
    this.noOfTicks = this.getNoOfTicks({
      'displacement': this.tickDisplacementFactor,
      'textWidth': maxStringLength,
      'chartWidth': this.scaleWidth
    });

    this.brushXScale = d3.scaleLinear().domain([0, this.chartData.xAxisData.length - 1])
      .range([0, this.scaleWidth]);

    let startingExtentIndex = null;

    if (this.chartData.xAxisData.length - 30 >= 0) {
      startingExtentIndex = this.chartData.xAxisData.length - 30;
    } else {
      startingExtentIndex = 0;
    }

    if (this.brush == null) {
      /*this.brush = d3.brushX()
        .extent([[0, 0], [this.scaleWidth, this.scaleHeight]])
        .handleSize(this.brushHeight)
        .on("brush", function () {
         // this.brushed(this)
        });*/
    }

    /*this.mainSVG.select(`.brush`).call(this.brush)
      .selectAll("rect").attr("y", 3)
      .attr("ry", 5)
      .attr("rx", 5)
      .attr("height", this.brushHeight)
      .attr("fill", "#000")
      .attr("opacity", .3);*/

    let rectwidth = this.scaleWidth / (this.chartData.xAxisData.length);

    this.dummyScale = d3.scaleLinear().domain([0, this.chartData.xAxisData.length - 1])
      .range([0, this.scaleWidth]);

    this.xScale = d3.scaleLinear().domain([0, this.chartData.xAxisData.length - 1])
      .range([rectwidth / 2, this.scaleWidth - (rectwidth / 2)]);

    this.xAxis = d3.axisBottom(this.xScale)
      .tickValues(this.getTicksIndex(0, this.chartData.xAxisData.length, maxStringLength, this.scaleWidth))
      .tickSizeInner(-this.chartHeight)
      .tickSizeOuter(0)
      .tickPadding(7);

    let xAxisGroup = this.mainSVG.select(`.xAxisGroup`).attr("transform", "translate(" + (this.areaChartMargins.left) + "," + (this.chartHeight + 5) + ")")
      //.attr("clip-path","url(#xAxisClip)")
      .call(this.xAxis).attr("fill", "none").attr("display", "block")
      .selectAll("text")
      .text('')
      .selectAll('tspan')
      .data(function(d, i) {
        var dateLabel = chartObj.xAxisFormatedData[d];
        return (dateLabel.toString()).split(" ");
      })
      .enter()
      .append('tspan')
      .attr('dy', 0)
      .attr('x', function(d, i) {
        return (2 * i) + 'em';
      })
      .text(String);

    this.xAxisDummy = d3.axisBottom(this.xScale)
      .tickValues(this.getTicksIndex(0, this.chartData.xAxisData.length, maxStringLength, this.scaleWidth))
        //  .tickSizeInner(0)
        //  .tickSizeOuter(0)
        .tickPadding(4);

    let xAxisGroupDummy = this.mainSVG.select(".xAxisGroupDummy").attr("transform", "translate(" + (this.areaChartMargins.left) + "," + (this.chartHeight + 5) + ")")
      //.attr("clip-path","url(#xAxisClip)")
      .call(this.xAxisDummy).attr("fill", "none").attr("display", "block")
        .selectAll("text").attr("fill", "#999999")
        .text('')
        .selectAll('tspan')
        .data(function (d, i) {
          var dateLabel = chartObj.xAxisFormatedData[d];
          return (dateLabel.toString()).split(" ");
        })
        .enter()
        .append('tspan')
        .attr('dy', 0)
        .attr('x', function (d, i) {
          return (2 * i) + 'em';
        })
        .text(String);

    //scaling for y-axis
    this.yScale = d3.scaleLinear().domain([this.yMin, this.yMax]).range([this.scaleHeight, 0]);

    this.yAxis = d3.axisRight(this.yScale)
      .tickFormat(function(d) {
        return d.toFixed(2);
      })
      .tickSizeInner(-this.scaleWidth)
      .tickSizeOuter(0)
      .tickPadding(5)
      .ticks(this.scaleHeight / 40);

    this.mainSVG.select(".yAxisGroup")
      .attr("transform", "translate(" + (this.scaleWidth + this.areaChartMargins.left) + "," + (this.areaChartMargins.top) + ")")
      .call(this.yAxis)
      .attr("fill", "none")
      .selectAll("text")
      .attr("fill", "#999999")

    let dummyScale = this.dummyScale;
    let yScale = this.yScale;
    let xScale = this.xScale;
    let yMin = this.yMin;
    let pgrBarHeight = this.pgrBarHeight;
    let palette = this.palette;

    this.mainSVG.selectAll(".close-line").remove();
    let lineFunction = d3.line()
      .x(function(d, i) {
        return dummyScale(i);
      })
      .y(function(d, i) {
        return yScale(d);
      })
      .defined(function(d) {
        return d;
      })

    let area = d3.area()
      .x(function(d, i) {
        return dummyScale(i);
      })
      .y0(yScale(yMin))
      .y1(function(d, i) {
        return yScale(d);
      })
      .defined(function(d) {
        return d;
      })

    this.areaGroup.append("path")
      .attr("d", area(chartObj.yAxisData.areaData))
      .attr("class", "area-chart")
      .attr("id", "areaChart")
      .attr("stroke-width", 2)
      .attr("fill", '#e7f5ff')
      //.style("opacity", .3)
      .attr("display", "block")

    this.areaGroup.append("path")
      .attr("d", lineFunction(chartObj.yAxisData.areaData))
      .attr("class", "area-line-chart")
      .attr("stroke", "#1199ff")
      .attr("stroke-width", 2.5)
      .attr("stroke-linejoin", "round")
      .attr("fill", "none")
      .style("opacity", 1)
      .style('shape-rendering', 'geometricPrecision')

    this.areaGroup.append("path")
      .attr("d", lineFunction(chartObj.yAxisData.lineData))
      .attr("class", "close-line-chart")
      .attr("stroke", "#ff9c17")
      .attr("stroke-width", 1.5)
      .attr("stroke-linejoin", "round")
      .attr("fill", "none")
      .style("opacity", 1)
      .style("stroke-dasharray", ("3, 3"))
      .style('shape-rendering', 'geometricPrecision')
    
    this.pgrBarChartGroup.selectAll("rect.rel-strength")
      .data(chartObj.yAxisData.rectData)
      .enter()
      .append("svg:rect")
      .attr("class", "rel-strength")
      .attr("id", function(d, i) {
        return "strength" + i;
      })
      .attr("x", function(d, i) {
        return xScale(i) - rectwidth / 2;
      })
      .attr("y", function(d) {
        return 0;
      })
      .attr("width", function(d, i) {
        if (d == null) {
          return 0;
        }
        else {
          return rectwidth;
        }
      })
      .attr("height", function(d, i) {
        if (d == null) {
          return 0;
        }
        else {
          return pgrBarHeight;
        }
      })
      .attr("fill", function(d, index) {
        return palette[d];
      })
      .attr("stroke", function(d, index) {
        return palette[d];
      });

    this.mainSVG.selectAll('.axis path').style('display', 'none');
    this.mainSVG.selectAll('.xAxisGroupDummy line').style('display', 'none');
    this.mainSVG.selectAll("line").style('shape-rendering', 'geometricPrecision')
      .style('stroke', '#c6c6c6');

    this.areaGroup.attr("clip-path", "url(#areaClip)");
    this.pgrBarChartGroup.attr("clip-path", "url(#pgrClip)");
    this.dummyParentGroup.attr("clip-path", "url(#chartClip)");
  }
  public getTicksIndex(minVal, maxVal, maxCharacterLength, svgWidth) {
    let tickArray = [];
    //let maxTickWidth = 2 * 6.5 * maxCharacterLength;
    let maxTickWidth = maxCharacterLength
    //let totalTicks = (svgWidth / maxTickWidth);
    let totalTicks = this.noOfTicks;
    let curval = minVal;
    tickArray.push(curval);
    let factor = (maxVal - minVal) / totalTicks;

    while(curval <maxVal) {
      //alert(curval+"::"+maxVal+"::"+factor);
      curval = Math.floor(curval + factor);
      if (tickArray.indexOf(curval) == -1 && curval <= maxVal - 1)
        tickArray.push(curval);
      else
        curval++;

    }
    return tickArray;
  }

  public textLength(xAxis) {
    var textWidth = 0;
    var dummyCanvas = document.createElement('canvas');
    dummyCanvas.id = "dummyCanvas";
    dummyCanvas.width = 1000;
    dummyCanvas.height = 1000;
    let dummyCanvasContext = dummyCanvas.getContext("2d");
    xAxis.forEach(function(value, index, arr) {
      if (textWidth < (dummyCanvasContext.measureText(value).width)) {
        textWidth = dummyCanvasContext.measureText(value).width;
      }
    });
    return textWidth;
  }

  public getNoOfTicks(resObj) {
    /* This method return total no of tick in integer which are drawn on particular width.
     1. displacementFactor is for increase or decrease textLength which result to dec. and inc. number of ticks.
     2. maxCharacterLength is a text length of single tick.
     3. width is total space on which ticks are to be drawn. */
    var displacementFactor = resObj.displacement;
    var maxCharacterLength = resObj.textWidth;
    var width = resObj.chartWidth;
    var maxTickWidth = displacementFactor * maxCharacterLength;
    var totalTicks = Math.round(width / maxTickWidth);
    return totalTicks;
  }
}

@Component({
  selector: 'panel-chart',
  template: `<div class="panel__chart" style="width: 100%; display:block; height:100%;" [id]="appendId()" row no-gutters> </div>`,
    styleUrls: ['./list-view.component.scss'],
})


export class ChartComponent implements AfterViewChecked {
  @Input('idea') idea: Subscription;
  public chartArray: Array<object> = [];
  constructor(private ideaService: IdeasService) {}

  public ngAfterViewChecked(): void {} 
  
  public ngAfterViewInit ():void{
    let self = this;
   
    let chartSymbol = this.idea['meta-info'].symbol;
    let chartObj = new InteractiveChart(self.idea['chart-points'], chartSymbol);
    chartObj.init();
  }
  
  public appendId(){
    return this.idea['meta-info'].symbol;
  }
}


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
