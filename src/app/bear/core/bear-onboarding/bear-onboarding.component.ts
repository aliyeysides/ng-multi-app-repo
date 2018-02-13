import {Component, OnInit} from '@angular/core';
import {BsModalRef} from 'ngx-bootstrap';

@Component({
  selector: 'cpt-bear-onboarding',
  template: `
    <div id="onboarding-modal">
      <div class="modal-header row">
        <div class="col-2"></div>
        <div class=" col-8"><h4 class="modal-title">Mastering The Bear Quick Start</h4></div>
        <div class="col-2">
          <button type="button" class="close" aria-label="Close" (click)="bsModalRef.hide()">
            <span aria-hidden="true"><i class="fa fa-times-circle"></i></span>
          </button>
        </div>
      </div>
      <div class="modal-body row">
        <div *ngIf="items.length">
          <ng-container *ngFor="let item of items">
            <ng-container *ngIf="currentPage === item.id">
              <img class="desktop hidden-sm-down" src="{{ item.src }}">
              <img class="mobile hidden-sm-up" *ngIf="item.mobileSrc" src="{{ item.mobileSrc }}">
              <a class="link__watch-video" target="_blank" *ngIf="item.link" href="{{ item.link }}">Learn more here &raquo;</a>
            </ng-container>
          </ng-container>
        </div>
      </div>
      <div class="modal-footer row">
        <div class="col-12">
          <pagination class="align-absolute" [itemsPerPage]="itemsPerPage" [totalItems]="totalItems" [(ngModel)]="currentPage"></pagination>
        </div>
        <ng-container *ngIf="currentPage === ( totalItems / itemsPerPage )">
          <a class="link__get-started" (click)="bsModalRef.hide()">Start!</a>
        </ng-container>
      </div>
    </div>
  `,
  styleUrls: ['./bear-onboarding.component.scss']
})
export class BearOnboardingComponent implements OnInit {
  totalItems: number;
  itemsPerPage = 1;
  currentPage = 1;
  items: Array<object> = [
    {
      id: 1,
      src: 'assets/imgs/MTB-onboarding__modal-1.png',
      mobileSrc: 'assets/imgs/img_onboard-screen1--mobile.png'
    },
    {
      id: 2,
      src: 'assets/imgs/MTB-onboarding__modal-2.png',
      mobileSrc: 'assets/imgs/img_onboard-screen2--mobile.png',
      link: 'https://www.chaikinanalytics.com/powerpulse-health-check-video/'
    },
    {
      id: 3,
      src: 'assets/imgs/MTB-onboarding__modal-3.png',
      mobileSrc: 'assets/imgs/img_onboard-screen3--mobile.png',
    },
    {
      id: 4,
      src: 'assets/imgs/MTB-onboarding__modal-4.png',
      mobileSrc: 'assets/imgs/img_onboard-screen4--mobile.png',
    },
    {
      id: 5,
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
