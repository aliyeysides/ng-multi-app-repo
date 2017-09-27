import {Component, OnDestroy, OnInit} from '@angular/core';
import {DiscoveryService} from '../../core/services/discovery.service';
import {Subject} from 'rxjs/Subject';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'cpt-discovery',
  template: `
    <div class="container discovery">
      <cpt-discovery-seed></cpt-discovery-seed>
    </div>
  `,
  styleUrls: ['./discovery.component.scss']
})
export class DiscoveryComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  // public metaInfo: Idea;
  // public results: object[];

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
    // this.metaInfo = res['metainfo'] as Idea;
    // this.results = res['results'];
  }

}
