import {Component, OnInit} from '@angular/core';
import {BsModalRef} from 'ngx-bootstrap';

@Component({
  selector: 'cpt-psp-onboarding',
  template: `
    <div class="modal-header">
      <h4 class="modal-title pull-left">Welcome to PowerPulse</h4>
      <button type="button" class="close pull-right" aria-label="Close" (click)="bsModalRef.hide()">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
      <div *ngIf="items.length">
        <ng-container *ngFor="let item of items">
          <ng-container *ngIf="currentPage === item.id">
            <img src="{{ item.src }}">
          </ng-container>
        </ng-container>
      </div>
    </div>
    <div class="modal-footer">
      <div class="col-xs-12 col-12">
        <pagination [itemsPerPage]="itemsPerPage" [totalItems]="totalItems" [(ngModel)]="currentPage"></pagination>
      </div>
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
      src: 'assets/imgs/screen-insights-100217-1.png'
    },
    {
      id: 2,
      src: 'assets/imgs/screen-insights-100217-2.png'
    }
  ];

  constructor(public bsModalRef: BsModalRef) {
  }

  ngOnInit() {
    this.totalItems = this.items.length;
  }

}
