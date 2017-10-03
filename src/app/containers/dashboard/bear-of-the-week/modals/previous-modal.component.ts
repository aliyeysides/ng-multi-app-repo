import {Component, OnInit} from '@angular/core';
import {BsModalRef} from 'ngx-bootstrap';

@Component({
  selector: 'cpt-bear-weekly-previous-modal',
  template: `
    <div class="insights__container insights__container--large insights__container--modal">
      <div class="post-head post-head--bearpick">
        <h2 class="modal-title pull-left">{{title}}</h2>
        <button type="button" class="post-head__button" aria-label="Close" (click)="bsModalRef.hide()">
          <a class="">
            <i class="fa fa-times-circle" aria-hidden="true"></i>
            <span>&nbsp;Close</span>
          </a>
        </button>
      </div>
      <div class="post-body">
        <!--<ul *ngIf="list.length">
          <li *ngFor="let item of list">{{item}}</li>
        </ul>-->
      </div>
    </div>
  `
})
export class PreviousBearsModalComponent implements OnInit {
  public title: string;
  public list: any[] = [];

  constructor(public bsModalRef: BsModalRef) {
  }

  ngOnInit() {
    this.title = 'Previous Picks';
  }
}
