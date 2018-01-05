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
      <!--<ul *ngIf="list.length">-->
        <!--<li *ngFor="let item of list">{{item}}</li>-->
      <!--</ul>-->
    </div>
    <div class="modal-footer">
      <!--<button type="button" class="btn btn-default" (click)="bsModalRef.hide()">Close</button>-->
    </div>
  `,
  styleUrls: ['./psp-onboarding.component.scss']
})
export class PspOnboardingComponent implements OnInit {

  constructor(public bsModalRef: BsModalRef) {}

  ngOnInit() {
  }

}
