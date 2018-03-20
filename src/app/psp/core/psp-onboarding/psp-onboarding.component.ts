import {Component, OnInit} from '@angular/core';
import {BsModalRef} from 'ngx-bootstrap';

@Component({
  selector: 'cpt-psp-onboarding',
  template: `
    <div class="modal-header row">
      <div class="col-2"></div>
      <div class=" col-8"><h4 class="modal-title">Getting Started</h4></div>
      <div class="col-2">
        <button type="button" class="close" aria-label="Close" (click)="bsModalRef.hide()">
          <span aria-hidden="true"><i class="far fa-times-circle"></i></span>
        </button>
      </div>
    </div>
    <div class="modal-body row">
      <div *ngIf="items.length">
        <ng-container *ngFor="let item of items">
          <ng-container *ngIf="currentPage === item.id">
            <p class="slide-title">{{ item.title }}</p>
            <img class="desktop hidden-sm-down" src="{{ item.src }}">
            <img class="mobile hidden-sm-up" *ngIf="item.mobileSrc" src="{{ item.mobileSrc }}">
            <a class="link__watch-video" target="_blank" *ngIf="item.link" href="{{ item.link }}"><i class="far fa-play-circle"></i> &nbsp; WATCH THE VIDEO</a>
          </ng-container>
        </ng-container>
      </div>
    </div>
    <div class="modal-footer row no-gutters">
      <div class="col-12">
        <pagination class="" [itemsPerPage]="itemsPerPage" [totalItems]="totalItems" [(ngModel)]="currentPage"></pagination>
      </div>
      <ng-container *ngIf="currentPage === ( totalItems / itemsPerPage )">
        <a class="link__get-started" (click)="bsModalRef.hide()">Start!</a>
      </ng-container>
    </div>
  `,
  styleUrls: ['./psp-onboarding.component.scss']
})
export class PspOnboardingComponent implements OnInit {
  totalItems: number;
  itemsPerPage = 1;
  currentPage = 1;
  items: Array<object> = [
    {
      id: 1,
      title: 'Welcome!',
      src: 'assets/imgs/img_onboard-screen1.png',
      mobileSrc: 'assets/imgs/img_onboard-screen1--mobile.png'
    },
    {
      id: 2,
      title: 'The Rating System',
      src: 'assets/imgs/img_onboard-screen2.png',
      mobileSrc: 'assets/imgs/img_onboard-screen2--mobile.png',
      link: 'https://www.chaikinanalytics.com/chaikin-powerpulse-user-guide/#the-workspace-2_wrap'
    },
    {
      id: 3,
      title: 'Health Check',
      src: 'assets/imgs/img_onboard-screen3.png',
      mobileSrc: 'assets/imgs/img_onboard-screen3--mobile.png',
      link: 'https://www.chaikinanalytics.com/powerpulse-health-check-video/'
    },
    {
      id: 4,
      title: 'Stock Analysis',
      src: 'assets/imgs/img_onboard-screen4.png',
      mobileSrc: 'assets/imgs/img_onboard-screen4--mobile.png',
      link: 'https://www.chaikinanalytics.com/powerpulse-stock-analysis/'
    },
    {
      id: 5,
      title: 'Market Insights',
      src: 'assets/imgs/img_onboard-screen5.png',
      mobileSrc: 'assets/imgs/img_onboard-screen5--mobile.png',
    },
  ];

  constructor(public bsModalRef: BsModalRef) {
  }

  ngOnInit() {
    this.totalItems = this.items.length;
  }

}
