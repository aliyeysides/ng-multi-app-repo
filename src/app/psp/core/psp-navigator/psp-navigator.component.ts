import {AfterViewInit, Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {HealthCheckService} from '../../../services/health-check.service';
import {Subject} from 'rxjs/Subject';

@Component({
  selector: 'cpt-psp-navigator',
  template: `
    <div class="nav-list">
      <ul>
        <li (click)="closeNav($event)" *ngFor="let route of routes"
            routerLinkActive="active"
            routerLink="{{ route.link }}">
          <a><i class="{{ route.klass }}" aria-hidden="true"></i> &nbsp;{{ route.label }}</a>
        </li>
      </ul>
    </div>
  `,
  styleUrls: ['./psp-navigator.component.scss']
})
export class PspNavigatorComponent implements OnInit, OnDestroy {
  private _ngUnsubscribe: Subject<void> = new Subject<void>();

  @Output('routeClicked') routeClicked: EventEmitter<void> = new EventEmitter<void>();

  firstUserStock: string;
  public routes = [
    {link: '/health-check', klass: 'fa fa-tachometer', label: 'Health Check'},
    {link: '/my-stocks/' + 'AAPL', klass: 'fa fa-list', label: 'My Stocks'},
    {link: '/market-beat', klass: 'fa fa-heartbeat', label: 'Market Beat'},
  ];


  constructor(private healthCheck: HealthCheckService) {
  }

  ngOnInit() {
    this.healthCheck.getUserStocks()
      .takeUntil(this._ngUnsubscribe)
      .filter(x => x != undefined)
      .subscribe(res => {
        this.firstUserStock = res[0].symbol;
        this.routes = [
          {link: '/health-check', klass: 'fa fa-tachometer', label: 'Health Check'},
          {link: '/my-stocks/' + this.firstUserStock, klass: 'fa fa-list', label: 'My Stocks'},
          {link: '/market-beat', klass: 'fa fa-heartbeat', label: 'Market Beat'},
        ];
      });
  }

  ngOnDestroy() {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }

  closeNav(e: Event) {
    this.routeClicked.emit();
    e.stopPropagation();
  }
}
