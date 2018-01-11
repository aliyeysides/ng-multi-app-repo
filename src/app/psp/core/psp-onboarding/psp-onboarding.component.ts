import {Component, OnInit} from '@angular/core';
import {BsModalRef} from 'ngx-bootstrap';

@Component({
  selector: 'cpt-psp-onboarding',
  template: `
    <div class="modal-header row">
      <div class="col-2"></div>
      <div class=" col-8"><h4 class="modal-title">Welcome to PowerPulse</h4></div>
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
            <img src="{{ item.src }}">
            <a target="_blank" *ngIf="item.link" href="item.link">link here</a>
          </ng-container>
        </ng-container>
      </div>
    </div>
    <div class="modal-footer row">
      <div class="col-12">
        <pagination class="align-absolute" [itemsPerPage]="itemsPerPage" [totalItems]="totalItems" [(ngModel)]="currentPage"></pagination>
      </div>
      <ng-container *ngIf="currentPage === ( totalItems / itemsPerPage )">
        <a (click)="bsModalRef.hide()">Go to app</a>
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
      src: 'assets/imgs/img_onboard-screen1.png',
    },
    {
      id: 2,
      src: 'assets/imgs/img_onboard-screen2.png',
    },
    {
      id: 3,
      src: 'assets/imgs/img_onboard-screen3.png',
      link: 'https://valor-software.com/ngx-bootstrap/#/pagination'
    },
    {
      id: 4,
      src: 'assets/imgs/img_onboard-screen4.png',
    },
    {
      id: 5,
      src: 'assets/imgs/img_onboard-screen5.png',
    },
  ];

  constructor(public bsModalRef: BsModalRef) {
  }

  ngOnInit() {
    this.totalItems = this.items.length;
  }

}
