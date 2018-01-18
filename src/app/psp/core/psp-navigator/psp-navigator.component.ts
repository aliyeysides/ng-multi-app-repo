import {
  Component, EventEmitter, HostListener, OnDestroy, OnInit,
  Output
} from '@angular/core';
import {HealthCheckService} from '../../../services/health-check.service';
import {Subject} from 'rxjs/Subject';
import {NavigationEnd, Router} from '@angular/router';
import {OrderByPipe} from '../../../shared/pipes/order-by.pipe';

@Component({
  selector: 'cpt-psp-navigator',
  template: `
    <ul>
      <li (click)="closeNav($event)" *ngFor="let route of routes"
          [ngClass]="{active: currentRoute?.slice(0,10) === route.link.slice(0,10) }"
          routerLink="{{ route.link }}">
        <a class="nav--toplevel"><i class="{{ route.klass }}" aria-hidden="true"></i> &nbsp;{{ route.label }}</a>
      </li>
    </ul>
  `,
  styleUrls: ['./psp-navigator.component.scss']
})
export class PspNavigatorComponent implements OnInit, OnDestroy {
  private _ngUnsubscribe: Subject<void> = new Subject<void>();

  @Output('routeClicked') routeClicked: EventEmitter<void> = new EventEmitter<void>();

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    const width = event.target.innerWidth;
    if (+width <= 1024) this.reportOpen = false;
    if (+width > 1024) this.reportOpen = true;
    this.updateRoutes();
  }

  firstUserStock: string;
  reportOpen: boolean;
  currentRoute: string;
  public routes: object[] = [
    {link: '/health-check', klass: 'fal fa-heartbeat', label: 'Health Check'},
    {link: '/stock-analysis', klass: 'fal fa-tachometer', label: 'Stock Analysis'},
    {link: '/market-insights', klass: 'fab fa-medapps', label: 'Market Insights'},
  ];


  constructor(private healthCheck: HealthCheckService,
              private orderByPipe: OrderByPipe,
              private router: Router) {

    const mobWidth = (window.screen.width);
    if (+mobWidth <= 1024) this.reportOpen = false;
    if (+mobWidth > 1024) this.reportOpen = true;

    this.router.events.filter(event => event instanceof NavigationEnd)
      .takeUntil(this._ngUnsubscribe)
      .subscribe(event => {
        this.currentRoute = event['url'];
      });
  }

  ngOnInit() {
    this.healthCheck.getUserStocks()
      .filter(x => x != undefined)
      .takeUntil(this._ngUnsubscribe)
      .subscribe(res => {
        console.log('res', res);
        res.length ? this.firstUserStock = this.orderByPipe.transform(res, 'PGR', false)[0].symbol : this.firstUserStock = '';
        this.updateRoutes();
      });
  }

  ngOnDestroy() {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }

  updateRoutes() {
    if (this.reportOpen) {
      this.routes = [
        {link: '/health-check', klass: 'fal fa-heartbeat', label: 'Health Check'},
        {link: '/stock-analysis/' + this.firstUserStock, klass: 'fal fa-tachometer', label: 'Stock Analysis'},
        {link: '/market-insights', klass: 'fab fa-medapps', label: 'Market Insights'},
      ];
      return;
    }
    this.routes = [
      {link: '/health-check', klass: 'fal fa-heartbeat', label: 'Health Check'},
      {link: '/stock-analysis', klass: 'fal fa-tachometer', label: 'Stock Analysis'},
      {link: '/market-insights', klass: 'fab fa-medapps', label: 'Market Insights'},
    ];
  }

  closeNav(e: Event) {
    this.routeClicked.emit();
    e.stopPropagation();
  }
}
