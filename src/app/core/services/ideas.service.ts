import {Injectable} from '@angular/core';
import {Http, URLSearchParams} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {UtilService} from './util.service';
import {IdeaList} from '../../shared/models/idea';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import * as d3 from 'd3';
import {NotificationsService} from 'angular2-notifications/dist';
import {Subject} from 'rxjs/Subject';
import {AuthService} from './auth.service';


@Injectable()
export class IdeasService {

  private apiHostName = this.utilService.getApiHostName();
  private ideaListsParams: URLSearchParams;
  private listSymbolsParams: URLSearchParams;
  private stockCardParams: URLSearchParams;
  private headlinesParams: URLSearchParams;
  private addStockIntoListParams: URLSearchParams;
  private deleteSymbolFromListParams: URLSearchParams;

  private _selectedList: BehaviorSubject<IdeaList> = new BehaviorSubject<IdeaList>({} as IdeaList);
  selectedList = this._selectedList.asObservable();

  private _updateAlerts: Subject<void> = new Subject<void>();
  updateAlerts$ = this._updateAlerts.asObservable();

  setSelectedList(list: IdeaList) {
    this._selectedList.next(list);
  }

  constructor(private utilService: UtilService,
              private toast: NotificationsService,
              private http: Http,
              private authService: AuthService) {
    this.ideaListsParams = new URLSearchParams();
    this.listSymbolsParams = new URLSearchParams();
    this.stockCardParams = new URLSearchParams();
    this.headlinesParams = new URLSearchParams();
    this.addStockIntoListParams = new URLSearchParams();
    this.deleteSymbolFromListParams = new URLSearchParams();
  }

  public getIdeasList(uid: string, product: string): Observable<Array<object>> {
    const ideaListLookupUrl = `${this.apiHostName}/CPTRestSecure/app/portfolio/getMidTierUserLists?`;
    this.ideaListsParams.set('uid', uid);
    this.ideaListsParams.set('productName', product);
    return this.utilService.getJson(ideaListLookupUrl, this.ideaListsParams);
  }

  public getListSymbols(listId: string, uid: string): Observable<Array<object>> {
    const listSymbolsUrl = `${this.apiHostName}/CPTRestSecure/app/midTier/getListSymbols?`;
    this.listSymbolsParams.set('listId', listId);
    this.listSymbolsParams.set('uid', uid);
    return this.utilService.getJson(listSymbolsUrl, this.listSymbolsParams);
  }

  public getStockCardData(symbol: string) {
    const getStockCardDataUrl = `${this.apiHostName}/CPTRestSecure/app/midTier/getStockCardData?`;
    this.stockCardParams.set('symbol', symbol);
    return this.utilService.getJson(getStockCardDataUrl, this.stockCardParams);
  }

  public getHeadlines(symbol: string) {
    const getHeadlinesUrl = `${this.apiHostName}/CPTRestSecure/app/xigniteNews/getHeadlines?`;
    this.headlinesParams.set('symbol', symbol);
    return this.utilService.getJson(getHeadlinesUrl, this.headlinesParams);
  }

  public addStockIntoList(listId: string, symbol: string) {
    const allowed = 30;
    const addStockIntoListUrl = `${this.apiHostName}/CPTRestSecure/app/portfolio/addStockIntoList?`;
    this.addStockIntoListParams.set('listId', listId);
    this.addStockIntoListParams.set('symbol', symbol);

    return this.authService
      .currentUser$
      .filter(x => x != undefined)
      .map(usr => usr['UID'])
      .flatMap(uid => this.getListSymbols(listId, uid))
      .map(res => res['symbols'].length < allowed)
      .flatMap(allowed => {
        if (allowed) {

          return this.http.get(addStockIntoListUrl, {
            search: this.addStockIntoListParams,
            withCredentials: true
          }).map(res => {
            const result = res.json();
            Object.keys(result).forEach((key) => {
              this.toast.success('Success!', 'Successfully added ' + key);
              this._updateAlerts.next();
            });
            return result as Observable<any>;
          }).catch((err) => Observable.throw(err))

        } else {
          this.toast.error('Oops...', "You have reached the 30 stock limit for what can be added to your user list. To add a stock, you must first remove something from your list.");
          return Observable.throw("You have reached the 30 stock limit for what can be added to your user list. To add a stock, you must first remove something from your list.")
        }
      });
  }

  public deleteSymbolFromList(listId: string, symbol: string) {
    const deleteSymbolFromListUrl = `${this.apiHostName}/CPTRestSecure/app/portfolio/deleteSymbolFromList?`;
    this.deleteSymbolFromListParams.set('symbol', symbol);
    this.deleteSymbolFromListParams.set('listId', listId);
    return this.http.get(deleteSymbolFromListUrl, {
      search: this.deleteSymbolFromListParams,
      withCredentials: true
    }).map(res => res.json())
      .catch(res => res.json())
  }

  public areaChartWithBrushing = {
    instance: null,
    chartData: null,
    id: null,
    selectorElement: null,
    height: null,
    width: null,
    mainSVG: null,
    yMin: null,
    yMax: null,
    brushXScale: null,
    brush: null,
    xScale: null,
    yScale: null,
    dummyScale: null,
    xAxis: null,
    xAxisDummy: null,
    yAxis: null,
    chartWidth: null,
    chartHeight: null,
    scaleHeight: null,
    scaleWidth: null,
    pgrBarHeight: null,
    brushHeight: 5,
    sectorHeightFactor: 10,
    margins: {left: 0, top: 5, right: 30, bottom: 35},
    areaChartMargins: {left: 10, right: 0, bottom: 0, top: 5},
    sectorMargins: {left: 0, right: 0, bottom: 0, top: 15},
    parentGroup: null,
    dummyParentGroup: null,
    visibleXAxis: null,
    parentSectorGroup: null,
    mainPGRGroup: null,
    pgrBarChartGroup: null,
    areaGroup: null,
    hoverLineGroup: null,
    noOfTicks: null,
    tickDisplacementFactor: 2.5,
    palette: {
      "-1": "grey",
      "0": "white",
      "1": "#EB001C",
      "2": "#EB001C",
      "3": "#ffbe00",
      "4": "#24A300",
      "5": "#24A300"
    },
    description: {
      //new description adding for rating -1 according to specification des 18
      "-1": "NONE",
      0: "NONE",
      1: "VERY BEARISH",
      2: "BEARISH",
      3: "NEUTRAL",
      4: "BULLISH",
      5: "VERY BULLISH"

    },
    appendToolTip: function (id) {
      let template = document.createElement('div');
      // template.className = 'tooltip-container cpt-tool-tip';
      // template.style = 'position: absolute; pointer-events: none; display: none; top: 38.5px; left: 490.5px;'

      template.innerHTML = `
        <div class="tooltip-container cpt-tool-tip" style= "position: absolute; pointer-events: none; display: none; top: 38.5px; left: 490.5px;" >
        <table class="tooltip" > <tbody>
          <tr><th colspan="2" id= "tool-heading" > </th></tr>
            <tr class="tooltip-name--data1" >
              <td class="name" >
                <span style="background-color:#c6c6c6" > </span>PGR
                  < /td>
                  < td class="value" id= "tool-pgr" > </td>
                    < /tr>
                    < tr class="tooltip-name--data1" >
                      <td class="name" >
                        <span style="background-color:#1f77b4" > </span>Close Price
                          < /td>
                          < td class="value" id= "tool-trend" > </td>
                            < /tr>
                            < tr class="tooltip-name--data2" >
                              <td class="name" >
                                <span style="background-color:#ff7f0e" > </span>Trend
                                  < /td>
                                  < td class="value" id= "tool-close-price" > </td>
                                    < /tr>
                                    < /tbody></table >
                                    </div>`;

      //this.selectorElement.append
      //   (document.getElementById(`${id}`).parentElement).appendChild(template);
      // console.log((document.getElementById(`${id}`))//.appendChild(template);
    },
    init: function (initParams) {
      let self = this;
      self.instance = this;
      //Adjust margin
      if (self.mainSVG == null) {
        this.margins.bottom = this.margins.bottom + this.brushHeight;
      }
      self.brush = null;
      self.id = initParams.id;
      this.selectorElement = document.getElementById(self.id);
      self.height = document.getElementById(self.id).clientHeight;
      self.width = document.getElementById(self.id).clientWidth;
      self.appendToolTip(self.id);
      self.setupChart(initParams);
    },
    svgOnMouseMove: function (mouseX, mouseY) {
      var self = this;
      d3.selectAll('.hoverLineY').remove();
      d3.selectAll('.hoverLineX').remove();

      let dataIndex = Math.round(self.xScale.invert(mouseX - (self.margins.left + self.areaChartMargins.left)));
      let yIndex = self.yScale.invert(mouseY - (self.margins.top + self.areaChartMargins.top))
      let left = self.margins.left + self.areaChartMargins.left;
      if (mouseX < left || mouseX > left + self.scaleWidth) {
        d3.select(".cpt-tool-tip").style("display", "none");
      }
      if (yIndex < self.yMin || yIndex > self.yMax) {
        d3.select(".cpt-tool-tip").style("display", "none");
      }
      /* $("#tool-heading").html(self.chartData.xAxisData[dataIndex])
       $("#tool-pgr").html(self.chartData.yAxisData.rectData[dataIndex])
       $("#tool-close-price").html(self.chartData.yAxisData.lineData[dataIndex]);
       $("#tool-trend").html(self.chartData.yAxisData.areaData[dataIndex])*/

      /*self.hoverLineGroup.append("line").attr("class", "hoverLineY hover-line").attr("opacity", 1).attr("stroke", "#000").style("stroke-dasharray", ("3, 3"));
       self.hoverLineGroup.append("line").attr("class", "hoverLineX hover-line").attr("opacity", 1).attr("stroke", "#000").style("stroke-dasharray", ("3, 3"));
       d3.select(".hoverLineY").attr("x1", 0).attr("x2", self.chartWidth).attr("y1", mouseY).attr("y2", mouseY);
       d3.select(".hoverLineX").attr("x1", mouseX).attr("x2", mouseX).attr("y1", 0).attr("y2", self.chartHeight).attr("xposition",mouseX).attr("yposition",mouseY);*/

      d3.select(".cpt-tool-tip").style("left", (mouseX + 15) + "px");
      d3.select(".cpt-tool-tip").style("top", mouseY + "px");

    },
    setupChart: function (response) {
      let self = this;
      if (self.mainSVG) {
        self.mainSVG.remove();
      }
      // draw SVG for chart
      self.mainSVG = d3.select(`#${self.id}`).append("svg")
        .attr("preserveAspectRatio", "none")
        .attr("viewBox", "0 0 " + self.width + " " + self.height + "")
        .attr("type", "chart").style("cursor", "crosshair")
        .on("mousemove", function () {
          /*var val = d3.select(this).attr("value");
           var heading = xAxisData[val];
           var yHeadingValueMap=[{"headingName":yAxisLabel,"headingVal":yAxisData[val]}];
           toolTipManager.showToolTip(d3.event,"",heading, false,yHeadingValueMap,d3.event.pageY*.95);*/
          d3.select(".cpt-tool-tip").style("display", "block");
          let mouseX = d3.mouse(this)[0];
          let mouseY = d3.mouse(this)[1];
          self.svgOnMouseMove(mouseX, mouseY);
        })
        .on("mouseleave", function () {
          d3.select(".cpt-tool-tip").style("display", "none")
          //toolTipManager.hideTooTip();
        });

      /*self.mainSVG.append("rect").attr("class", "hoverYAxis").attr('width',self.width)
       .attr('height',self.height).attr('x',0).attr('y',0).attr('fill','oldlace');*/

      self.hoverLineGroup = self.mainSVG.append("g").attr("class", "hoverLineGroup");

      /*self.hoverLineGroup.append("line").attr("class", "hoverLineY hover-line").attr("opacity", 1).attr("stroke", "#000").style("stroke-dasharray", ("3, 3"));
       self.hoverLineGroup.append("line").attr("class", "hoverLineX hover-line").attr("opacity", 1).attr("stroke", "#000").style("stroke-dasharray", ("3, 3"));
       */
      //draw main GROUP which append with main SVG for draw chart
      self.parentGroup = self.mainSVG.append("g").attr("class", "parentGroup").attr("transform", "translate(" + self.margins.left + "," + self.margins.top + ")");
      self.dummyParentGroup = self.mainSVG.append("g").attr("class", "dummyGroup").attr("transform", "translate(" + (self.margins.left + self.areaChartMargins.left) + "," + (self.margins.top + self.areaChartMargins.top) + ")");
      self.visibleXAxis = self.mainSVG.append("g").attr("class", "dummyGroup").attr("transform", "translate(" + (self.margins.left + self.areaChartMargins.left) + "," + (self.margins.top + self.areaChartMargins.top) + ")");

      // Actual width and height for charts
      self.chartWidth = self.width - self.margins.left - self.margins.right;
      self.chartHeight = self.height - self.margins.top - self.margins.bottom;
      var lowerChartHeight = self.sectorHeightFactor;
      //Setting the area-chart height as we have lower bar shown at the bottom too by default.
      self.scaleHeight = self.chartHeight - lowerChartHeight;

      self.scaleWidth = self.chartWidth - self.areaChartMargins.left - self.areaChartMargins.right;

      self.scaleHeight = self.scaleHeight - self.areaChartMargins.top - self.areaChartMargins.bottom;

      self.parentGroup.append("g").attr("class", "area-clip-path")
        .attr("transform", "translate(" + self.areaChartMargins.left + "," + self.areaChartMargins.top + ")")
        .append("defs").append("clipPath").attr("id", "areaClip").append("rect").attr("class", "areaPathViewport").attr("width", self.scaleWidth)
        .attr("height", self.scaleHeight);

      self.dummyParentGroup.append("g").attr("class", "chart-clip-path")
        .append("defs").append("clipPath").attr("id", "chartClip").append("rect").attr("class", "areaPathViewport").attr("width", self.scaleWidth)
        .attr("height", self.chartHeight + self.areaChartMargins.bottom);

      self.areaGroup = self.parentGroup.append("g").attr("class", "areaGroup")
        .attr("transform", "translate(" + self.areaChartMargins.left + "," + self.areaChartMargins.top + ")");

      /*self.areaGroup.append("rect").attr("class", "area-background")
       .attr("x", 0).attr("y", 0).attr("width", self.scaleWidth)
       .attr("height", (self.scaleHeight))
       .attr("fill", "cyan").attr("opacity", "0.5");*/


      //create background rectangle for brush
      self.parentGroup.append("g").attr("class", "brush-backgroud-group").attr("transform", "translate(" + (self.areaChartMargins.left) + "," + ((self.margins.bottom / 2) + self.chartHeight) + ")")
        .append("rect").attr("class", "brush-background-rect")
        .attr("y", 3).attr("height", self.brushHeight)
        .attr("width", self.scaleWidth).attr("fill", "blue")
        .attr("opacity", 0.03);

      //Create brush for the charts
      self.parentGroup.append("g").attr("transform", "translate(" + (self.areaChartMargins.left) + "," + ((self.margins.bottom / 2) + self.chartHeight) + ")")
        .attr("class", "x brush");

      self.dummyParentGroup.append("g").attr("class", "xAxisGroup axis");
      self.visibleXAxis.append("g").attr("class", "xAxisGroupDummy axis");
      self.parentGroup.append("g").attr("class", "xAxisGroupAdvance");

      // Draw Group for y Axis in which append y Axis
      self.parentGroup.append("g").attr("class", "yAxisGroup yAxis axis");

      //Parent sector group for all other sectors.
      self.parentSectorGroup = self.parentGroup.append("g").attr("class", "parentSectorGroup")
        .attr("transform", "translate(" + self.areaChartMargins.left + "," + (self.scaleHeight + self.areaChartMargins.bottom + self.areaChartMargins.top) + ")");

      /*self.parentSectorGroup.append("rect").attr("class", "parentSectorGroup-background")
       .attr("x", 0).attr("y", 0).attr("width", self.scaleWidth)
       .attr("height", (self.chartHeight - (self.scaleHeight + self.areaChartMargins.top + self.areaChartMargins.bottom)))
       .attr("fill", "blue").attr("opacity", "0.5");*/

      //Outermost group for bar
      self.mainPGRGroup = self.parentSectorGroup.append("g").attr("class", "main-pgr-group")

      //actual container group for bars.
      self.pgrBarChartGroup = self.mainPGRGroup.append("g").attr("class", "pgr-bars-group")
        .attr("transform", "translate(" + (0) + "," + (0) + ")");

      self.pgrBarChartGroup.append("g").attr("class", "pgr-clip-path")
        .append("defs").append("clipPath").attr("id", "pgrClip").append("rect").attr("class", "areaPathViewport").attr("width", self.scaleWidth)
        .attr("height", self.scaleHeight);

      self.pgrBarHeight = self.chartHeight - (self.scaleHeight + self.areaChartMargins.top + self.areaChartMargins.bottom);
      /*
       self.pgrBarChartGroup.append("rect").attr("class", "parentSectorGroup-background")
       .attr("x", 0).attr("y", 0).attr("width", self.scaleWidth)
       .attr("height", (self.pgrBarHeight))
       .attr("fill", "red").attr("opacity", "0.5");*/


      self.chartData = response.data;

      self.updateChart(response);


    },
    updateChart: function (response) {
      var self = this;

      // calculate maximum and minimum value for y scaling
      self.yMin = d3.min(self.chartData.yAxisData.lineData.concat(self.chartData.yAxisData.areaData));
      self.yMax = d3.max(self.chartData.yAxisData.lineData.concat(self.chartData.yAxisData.areaData));

      /*d3.select(".parentSectorGroup")
       .attr("transform","translate(" + (0) + "," + (self.scaleHeight + self.areaChartMargins.bottom + self.areaChartMargins.top) +")")*/

      /*d3.select(".parentSectorGroup-background")
       .attr("x", 0).attr("y", 0).attr("width", self.scaleWidth)
       .attr("height", (self.chartHeight - (self.scaleHeight + self.areaChartMargins.top + self.areaChartMargins.bottom)))  */

      d3.select(".brush-background-rect").attr("width", self.scaleWidth);

      let maxStringLength = self.textLength(self.chartData.xAxisData);
      self.noOfTicks = self.getNoOfTicks({
        'displacement': self.tickDisplacementFactor,
        'textWidth': maxStringLength,
        'chartWidth': self.scaleWidth
      });

      self.brushXScale = d3.scaleLinear().domain([0, self.chartData.xAxisData.length - 1])
        .range([0, self.scaleWidth]);

      let startingExtentIndex = null;

      if (self.chartData.xAxisData.length - 30 >= 0) {
        startingExtentIndex = self.chartData.xAxisData.length - 30;
      } else {
        startingExtentIndex = 0;
      }

      if (self.brush == null) {
        self.brush = d3.brushX()
          .extent([[0, 0], [self.scaleWidth, self.scaleHeight]])
          .handleSize(self.brushHeight)
          .on("brush", function () {
            self.brushed(self)
          });

        //have to write it in else too for a reason.
        /*self.brush.extent([[self.brushXScale.range()[0], startingExtentIndex], [self.brushXScale.range()[1], self.chartData.xAxisData.length - 1]])
         .on("brush", function() { self.brushed(self); d3.selectAll(".navHandles").attr("opacity", 1); });*/
        //console.log(self.brush.extent()[1]);
        //console.log(d3.event.selection.map(self.brush.invert));
        //  self.brush.extent([startingExtentIndex, self.chartData.xAxisData.length - 1]);
        //  self.brush.event(d3.select(".brush").transition().delay(100));
      }

      d3.select(".brush").call(self.brush)
        .selectAll("rect").attr("y", 3)
        .attr("ry", 5)
        .attr("rx", 5)
        .attr("height", self.brushHeight)
        .attr("fill", "#000")
        .attr("opacity", .3);

      //let rectwidth = self.xScale(1) - self.xScale(0);
      let rectwidth = self.scaleWidth / (self.chartData.xAxisData.length);
      //console.log(self.xScale(1) - self.xScale(0));

      self.dummyScale = d3.scaleLinear().domain([0, self.chartData.xAxisData.length - 1])
        .range([0, self.scaleWidth]);

      //scaling for x-axis
      self.xScale = d3.scaleLinear().domain([0, self.chartData.xAxisData.length - 1])
        .range([rectwidth / 2, self.scaleWidth - (rectwidth / 2)]);

      self.xAxis = d3.axisBottom(self.xScale)
        .tickValues(self.getTicksIndex(0, self.chartData.xAxisData.length, maxStringLength, self.scaleWidth))
        .tickSizeInner(-self.chartHeight)
        .tickSizeOuter(0)
        .tickPadding(7);

      let xAxisGroup = d3.select(".xAxisGroup").attr("transform", "translate(" + (self.areaChartMargins.left) + "," + (self.chartHeight + 5) + ")")
      //.attr("clip-path","url(#xAxisClip)")
        .call(self.xAxis).attr("fill", "none").attr("display", "block")
        .selectAll("text")
        .text('')
        .selectAll('tspan')
        .data(function (d, i) {
          var dateLabel = self.chartData.xAxisFormatedData[d];
          /*var axisDate = Common.getESTDate(self.xAxisData[d]);
           if(self.apiType == self.apiTypes.INTRA) {
           var finalLabelObject = self.getMinuteWiseXAxisLabels(previousDateAdvance, d);
           previousDateAdvance = finalLabelObject.previousDate;
           dateLabel = finalLabelObject.label;
           } else {
           var finalLabelObject = self.getDailyXAxisLabels(previousDateAdvance, d);
           previousDateAdvance = finalLabelObject.previousDate;
           dateLabel = finalLabelObject.label;
           }  */
          return (dateLabel.toString()).split(" ");
        })
        .enter()
        .append('tspan')
        .attr('dy', 0)
        .attr('x', function (d, i) {
          return (2 * i) + 'em';
        })
        .text(String);

      self.xAxisDummy = d3.axisBottom(self.xScale)
        .tickValues(self.getTicksIndex(0, self.chartData.xAxisData.length, maxStringLength, self.scaleWidth))
        //  .tickSizeInner(0)
        //  .tickSizeOuter(0)
        .tickPadding(4);

      let xAxisGroupDummy = d3.select(".xAxisGroupDummy").attr("transform", "translate(" + (self.areaChartMargins.left) + "," + (self.chartHeight + 5) + ")")
      //.attr("clip-path","url(#xAxisClip)")
        .call(self.xAxisDummy).attr("fill", "none").attr("display", "block")
        .selectAll("text").attr("fill", "#999999")
        .text('')
        .selectAll('tspan')
        .data(function (d, i) {
          var dateLabel = self.chartData.xAxisFormatedData[d];
          /*var axisDate = Common.getESTDate(self.xAxisData[d]);
           if(self.apiType == self.apiTypes.INTRA) {
           var finalLabelObject = self.getMinuteWiseXAxisLabels(previousDateAdvance, d);
           previousDateAdvance = finalLabelObject.previousDate;
           dateLabel = finalLabelObject.label;
           } else {
           var finalLabelObject = self.getDailyXAxisLabels(previousDateAdvance, d);
           previousDateAdvance = finalLabelObject.previousDate;
           dateLabel = finalLabelObject.label;
           }  */
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
      self.yScale = d3.scaleLinear().domain([self.yMin, self.yMax]).range([self.scaleHeight, 0]);

      self.yAxis = d3.axisRight(self.yScale)
        .tickFormat(function (d) {
          return d.toFixed(2);
        })
        .tickSizeInner(-self.scaleWidth)
        .tickSizeOuter(0)
        .tickPadding(5)
        .ticks(self.scaleHeight / 40);

      d3.select(".yAxisGroup")
        .attr("transform", "translate(" + (self.scaleWidth + self.areaChartMargins.left) + "," + (self.areaChartMargins.top) + ")")
        .call(self.yAxis)
        .attr("fill", "none")
        .selectAll("text")
        .attr("fill", "#999999")


      d3.selectAll(".close-line").remove();
      let lineFunction = d3.line()
        .x(function (d, i) {
          return self.dummyScale(i);
        })
        .y(function (d, i) {
          return self.yScale(d);
        })
        .defined(function (d) {
          return d;
        })

      let area = d3.area()
        .x(function (d, i) {
          return self.dummyScale(i);
        })
        .y0(self.yScale(self.yMin))
        .y1(function (d, i) {
          return self.yScale(d);
        })
        .defined(function (d) {
          return d;
        })

      self.areaGroup.append("path")
        .attr("d", area(self.chartData.yAxisData.areaData))
        .attr("class", "area-chart")
        .attr("id", "areaChart")
        .attr("stroke-width", 2)
        .attr("fill", '#e7f5ff')
        //.style("opacity", .3)
        .attr("display", "block")

      self.areaGroup.append("path")
        .attr("d", lineFunction(self.chartData.yAxisData.areaData))
        .attr("class", "area-line-chart")
        .attr("stroke", "#1199ff")
        .attr("stroke-width", 2.5)
        .attr("stroke-linejoin", "round")
        .attr("fill", "none")
        .style("opacity", 1)
        .style('shape-rendering', 'geometricPrecision')


      self.areaGroup.append("path")
        .attr("d", lineFunction(self.chartData.yAxisData.lineData))
        .attr("class", "close-line-chart")
        .attr("stroke", "#ff9c17")
        .attr("stroke-width", 1.5)
        .attr("stroke-linejoin", "round")
        .attr("fill", "none")
        .style("opacity", 1)
        .style("stroke-dasharray", ("3, 3"))
        .style('shape-rendering', 'geometricPrecision')

      self.pgrBarChartGroup.selectAll("rect.rel-strength")
        .data(self.chartData.yAxisData.rectData)
        .enter()
        .append("svg:rect")
        .attr("class", "rel-strength")
        .attr("id", function (d, i) {
          return "strength" + i;
        })
        .attr("x", function (d, i) {
          return self.xScale(i) - rectwidth / 2;
        })
        .attr("y", function (d) {
          return 0;
        })
        .attr("width", function (d, i) {
          if (d == null) {
            return 0;
          }
          else {
            return rectwidth;
          }
        })
        .attr("height", function (d, i) {
          if (d == null) {
            return 0;
          }
          else {
            return self.pgrBarHeight;
          }
        })
        .attr("fill", function (d, index) {
          return self.palette[d];
        })
        .attr("stroke", function (d, index) {
          return self.palette[d];
        });

      self.updateScales();

      d3.selectAll('.axis path').style('display', 'none');
      d3.selectAll('.xAxisGroupDummy line').style('display', 'none');
      d3.selectAll("line").style('shape-rendering', 'geometricPrecision')
        .style('stroke', '#c6c6c6');

      self.areaGroup.attr("clip-path", "url(#areaClip)");
      self.pgrBarChartGroup.attr("clip-path", "url(#pgrClip)");
      self.dummyParentGroup.attr("clip-path", "url(#chartClip)");
      d3.select(".brush").selectAll(".handle")
        .append("rect")
        .attr("class", "navHandles")
        .attr("fill", "#2C58BB")
        .attr("x", 0).attr("opacity", .75)
        .attr("y", 0)
        .attr("width", 7)
        .attr("height", self.brushHeight);
      d3.select(".brush").selectAll(".selection").attr("height", self.brushHeight)
    },
    brushed: function (ref) {

      var self = ref;
      if (d3.event.sourceEvent.type === "brush") return;
      //if (!d3.event.sourceEvent) return; // Only transition after input.
      // if (!d3.event.selection) return; // Ignore empty selections.
      d3.select(".brush").selectAll(".selection")
        .attr("height", 2.5 * self.brushHeight)
        .attr("fill", "#2C58BB")
        .attr("opacity", 0.5)
        .attr("y", -.5)
        .attr("ry", 0)
        .attr("rx", 0);

      d3.selectAll(".handle--e")
        .attr("height", 18)
        .attr("ry", 2)
        .attr("rx", 2);

      d3.selectAll(".handle--w")
        .attr("height", 18)
        .attr("ry", 2)
        .attr("rx", 2);

      var d0 = d3.event.selection.map(self.brushXScale.invert);
      // d1 = d0.map(d3.timeMonth.round),

      if (d0[0] >= d0[1]) {
        /* d0[0] = d3.timeMonth.floor(d0[0]);
         d0[1] = d3.timeMonth.offset(d0[0]);*/
      }
      d0[0] = Math.floor(d0[0]);
      d0[1] = Math.floor(d0[1])
      if ((d0[0] >= d0[1]) && (d0[0] - d0[1]) < 5) {
        return;
      } else if ((d0[0] <= d0[1]) && (d0[1] - d0[0]) < 5) {
        return;
      }
      //let rectwidth = self.xScale(1) - self.xScale(0);
      let rectwidth = self.scaleWidth / (d0[1] - d0[0] + 1);

      let lineFunction = d3.line()
        .x(function (d, i) {
          return self.dummyScale(i);
        })
        .y(function (d, i) {
          return self.yScale(d);
        })
        .defined(function (d) {
          return d;
        })
      let area = d3.area()
        .x(function (d, i) {
          return self.dummyScale(i);
        })
        .y0(self.yScale(self.yMin))
        .y1(function (d, i) {
          return self.yScale(d);
        })
        .defined(function (d) {
          return d;
        })

      self.yMin = d3.min((self.chartData.yAxisData.lineData.slice(d0[0], d0[1] + 1)).concat((self.chartData.yAxisData.areaData.slice(d0[0], d0[1] + 1))));
      self.yMax = d3.max((self.chartData.yAxisData.lineData.slice(d0[0], d0[1] + 1)).concat((self.chartData.yAxisData.areaData.slice(d0[0], d0[1] + 1))));
      self.dummyScale.domain([d0[0], d0[1]]).range([0, self.scaleWidth]);
      self.xScale.domain([d0[0], d0[1]]).range([rectwidth / 2, self.scaleWidth - (rectwidth / 2)]);
      self.yScale.domain([self.yMin, self.yMax]);

      d3.select(".yAxisGroup").call(self.yAxis)
        .attr("fill", "none").selectAll("text").attr("fill", "#999999");
      //Updating candle yScale
      /*      self.candleYMin = d3.min(self.lowValuesArr.slice(min, dataIndex + 1));
       self.candleYMax = d3.max(self.highValuesArr.slice(min, dataIndex + 1));*/


      d3.select(".xAxisGroup")
        .attr("transform", "translate(" + (self.areaChartMargins.left) + "," + (self.chartHeight + 5) + ")")
        //.attr("clip-path","url(#xAxisClip)")
        .call(self.xAxis).attr("fill", "none").attr("display", "block")
        .selectAll("text")
        .text('')
        .selectAll('tspan')
        .data(function (d, i) {
          var dateLabel = self.chartData.xAxisFormatedData[d];
          /*var axisDate = Common.getESTDate(self.xAxisData[d]);
           if(self.apiType == self.apiTypes.INTRA) {
           var finalLabelObject = self.getMinuteWiseXAxisLabels(previousDateAdvance, d);
           previousDateAdvance = finalLabelObject.previousDate;
           dateLabel = finalLabelObject.label;
           } else {
           var finalLabelObject = self.getDailyXAxisLabels(previousDateAdvance, d);
           previousDateAdvance = finalLabelObject.previousDate;
           dateLabel = finalLabelObject.label;
           }  */
          return (dateLabel.toString()).split(" ");
        })
        .enter()
        .append('tspan')
        .attr('dy', 0)
        .attr('x', function (d, i) {
          return (1.4 * i) + 'em';
        })
        .text(String);

      d3.select(".xAxisGroupDummy")
        .attr("transform", "translate(" + (self.areaChartMargins.left) + "," + (self.chartHeight + 5) + ")")
        //.attr("clip-path","url(#xAxisClip)")
        .call(self.xAxis).attr("fill", "none").attr("display", "block")
        .selectAll("text")
        .text('')
        .selectAll('tspan')
        .data(function (d, i) {
          var dateLabel = self.chartData.xAxisFormatedData[d];
          /*var axisDate = Common.getESTDate(self.xAxisData[d]);
           if(self.apiType == self.apiTypes.INTRA) {
           var finalLabelObject = self.getMinuteWiseXAxisLabels(previousDateAdvance, d);
           previousDateAdvance = finalLabelObject.previousDate;
           dateLabel = finalLabelObject.label;
           } else {
           var finalLabelObject = self.getDailyXAxisLabels(previousDateAdvance, d);
           previousDateAdvance = finalLabelObject.previousDate;
           dateLabel = finalLabelObject.label;
           }  */
          return (dateLabel.toString()).split(" ");
        })
        .enter()
        .append('tspan')
        .attr('dy', 0)
        .attr('x', function (d, i) {
          return (1.4 * i) + 'em';
        })
        .text(String);

      self.areaGroup.selectAll("#areaChart")
        .attr("d", area(self.chartData.yAxisData.areaData))

      d3.selectAll(".area-line-chart")
        .attr("d", lineFunction(self.chartData.yAxisData.areaData))

      d3.selectAll(".close-line-chart")
        .attr("d", lineFunction(self.chartData.yAxisData.lineData))

      self.pgrBarChartGroup.selectAll("rect.rel-strength")
        .data(self.chartData.yAxisData.rectData)
        .attr("x", function (d, i) {
          return self.xScale(i) - rectwidth / 2;
        })
        .attr("y", function (d) {
          return 0;
        })
        .attr("width", function (d, i) {
          if (d == null) {
            return 0;
          }
          else {
            return rectwidth;
          }
        })
        .attr("height", function (d, i) {
          if (d == null) {
            return 0;
          }
          else {
            return self.pgrBarHeight;
          }
        })
        .attr("fill", function (d, index) {
          return self.palette[d];
        })
        .attr("stroke", function (d, index) {
          return self.palette[d];
        });


      d3.selectAll("line").style('shape-rendering', 'crispEdges')
        .style('stroke', '#c6c6c6')

      d3.select(".brush").selectAll(".selection")
        .attr("height", 2.5 * self.brushHeight)
        .attr("fill", "#000")
        .attr("opacity", 1)
        .attr("y", -.5)

      d3.selectAll(".handle--e")
        .attr("height", 18);
      d3.selectAll(".handle--w")
        .attr("height", 18);
      /*d3.select(".brush").selectAll(".handle")
       .append("rect")
       .attr("class", "navHandles")
       .attr("fill", "#000")
       .attr("opacity", 1)
       .attr("x", 0)
       .attr("y", -.5)
       .attr("width", 7)
       .attr("height", self.brushHeight);*/

    },
    zoomed: function (self) {
      /*var leftExtent = Math.max(0, self.xScale.invert(0));
       var rightExtent = self.brush.extent()[1];
       if((self.candleData.length - rightExtent) < 10) {
       rightExtent = self.candleData.length - 1;
       }

       self.brush.extent([Math.round(leftExtent), rightExtent]);

       self.updateBrushParameters(self);

       d3.select(".brush").call(self.brush);
       var args = { identity: self.chartUId, type : 'zoom' };

       self.updateScales();
       var mouseX = parseInt(d3.select(".hoverLineX").attr("xposition"));
       var mouseY =  parseInt(d3.select(".hoverLineX").attr("yposition"));
       self.svgOnMouseMove(mouseX,mouseY);*/
    },
    updateScales: function () {


    },
    getTicksIndex: function (minVal, maxVal, maxCharacterLength, svgWidth) {
      let tickArray = [];
      //let maxTickWidth = 2 * 6.5 * maxCharacterLength;
      let maxTickWidth = maxCharacterLength
      //let totalTicks = (svgWidth / maxTickWidth);
      let totalTicks = this.noOfTicks;
      let curval = minVal;
      tickArray.push(curval);
      let factor = (maxVal - minVal) / totalTicks;

      while (curval < maxVal) {
        //alert(curval+"::"+maxVal+"::"+factor);
        curval = Math.floor(curval + factor);
        if (tickArray.indexOf(curval) == -1 && curval <= maxVal - 1)
          tickArray.push(curval);
        else
          curval++;

      }
      return tickArray;

    },
    textLength: function (xAxis) {
      var textWidth = 0;
      var dummyCanvas = document.createElement('canvas');
      dummyCanvas.id = "dummyCanvas";
      dummyCanvas.width = 1000;
      dummyCanvas.height = 1000;
      let dummyCanvasContext = dummyCanvas.getContext("2d");
      xAxis.forEach(function (value, index, arr) {
        if (textWidth < (dummyCanvasContext.measureText(value).width)) {
          textWidth = dummyCanvasContext.measureText(value).width;
        }
      });
      return textWidth;
    },
    getNoOfTicks: function (resObj) {
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

}
