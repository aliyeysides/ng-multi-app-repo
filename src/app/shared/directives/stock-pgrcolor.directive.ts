import {Directive, Input, ElementRef, OnChanges, SimpleChanges} from '@angular/core';
import {ReportService} from '../../services/report.service';
import {PortfolioStatus} from '../models/health-check';

@Directive({
  selector: '[cptStockPgrColor]'
})
export class StockPgrColorDirective implements OnChanges {
  @Input() stock: string;
  @Input() status: PortfolioStatus;

  red: string = 'linear-gradient(45deg, rgba(253,0,31,1) 0%, rgba(234,0,61,1) 51%, rgba(183,0,86,1) 100%)';
  yellow: string = 'linear-gradient(-135deg, rgba(250,218,61,1) 0%, rgba(248,153,57,1) 100%)';
  green: string = 'linear-gradient(135deg, rgba(0,192,78,1) 0%, rgba(0,193,169,1) 100%)';

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
