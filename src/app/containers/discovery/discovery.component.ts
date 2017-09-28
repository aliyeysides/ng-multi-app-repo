import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {DiscoveryService} from '../../core/services/discovery.service';
import {Subject} from 'rxjs/Subject';
import {ActivatedRoute, Router} from '@angular/router';
import {Idea} from '../../shared/models/idea';

@Component({
  selector: 'cpt-discovery',
  template: `
    <div class="container-fluid">
      <div class="discovery__body body">
        <div class="body__top">
          <div class="row--header header text-center row no-gutters">
            <h1 class="col-12">Discovery Results for</h1>
          </div>
          <cpt-discovery-seed (addToListClicked)="addToList($event)"
                               (viewStockReportClicked)="viewStockReport($event)"
                               [metaInfo]="metaInfo"></cpt-discovery-seed>
        </div>
        <div class="body__bottom">
          <cpt-discovery-results (addToListClicked)="addToList($event)"
                                 (viewStockReportClicked)="viewStockReport($event)"
                                 (viewStockDiscoveryClicked)="viewStockDiscovery($event)"
                                 [results]="results"></cpt-discovery-results>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./discovery.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DiscoveryComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  public metaInfo: Idea;
  public results: object[];

  constructor(private router: Router,
              private discoveryService: DiscoveryService,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.params
      .map(params => params.symbol)
      .switchMap(val => this.discoveryService.getDiscoveryResultLists(val))
      .takeUntil(this.ngUnsubscribe)
      .subscribe(res => {
        this.parseDiscoveryResponse(res);
      });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public viewStockReport(ticker: string) {
    this.router.navigate(['/report', ticker]);
  }

  public viewStockDiscovery(ticker: string) {
    this.router.navigate(['/discovery', ticker]);
  }

  // public addToList(params: AddListConfig) {
  //  TODO: implement app add to list service
  // }

  private parseDiscoveryResponse(res: object) {
    this.metaInfo = res['metainfo'] as Idea;
    this.results = res['results'];
  }

}
