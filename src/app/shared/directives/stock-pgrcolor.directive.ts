import {Directive, Input, ElementRef, OnChanges, SimpleChanges} from '@angular/core';
import {ReportService} from '../../services/report.service';
import {PortfolioStatus} from '../models/health-check';

@Directive({
  selector: '[cptStockPgrColor]'
})
export class StockPgrColorDirective implements OnChanges {
  @Input() stock: string;
  @Input() status: PortfolioStatus;

  red: string = '#D0021B';
  yellow: string = '#F5A623';
  green: string = '#24A300';

  constructor(private el: ElementRef, private reportService: ReportService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['stock']) {
      if (this.stock) {
        this.reportService.getSymbolData(this.stock).take(1).subscribe(res => {
          const pgr = res['pgr'][0]['PGR Value'];
          if (pgr<3) this.colorEl(this.red);
          if (pgr==3) this.colorEl(this.yellow);
          if (pgr>3) this.colorEl(this.green);
        });
      } else {
        if (this.status) {
          if (this.status.avgPercentageChange > 0) this.colorEl(this.green);
          if (this.status.avgPercentageChange < 0) this.colorEl(this.red);
        }
      }
    }
  }

  colorEl(color: string) {
    this.el.nativeElement.style.background = color;
  }

}
