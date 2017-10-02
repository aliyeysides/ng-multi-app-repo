import {Component, OnInit} from '@angular/core';
import {BsModalRef} from 'ngx-bootstrap';

@Component({
  selector: 'cpt-bear-commentary-weekly-modal',
  template: `
    <div class="insights__container insights__container--large insights__container--modal"> 
      <div class="post-head post-head--bearpick">
        <h2 class="">{{title}}</h2>
        <div class="divider-h"></div>
        <p class="header__post-date">September 27th, 2017</p>
        <button type="button" class="post-head__button" aria-label="Close" (click)="bsModalRef.hide()">
          <a class="">
            <i class="fa fa-times-circle" aria-hidden="true"></i>
            <span>&nbsp;Close</span>
          </a>
        </button>
        <a (click)="openPreviousModal()" class="post-head__button">
          <i class="fa fa-calendar" aria-hidden="true"></i>
          <span>&nbsp;Previous</span>
        </a>
      </div>
      <div class="post-body">
        <ul *ngIf="list.length">
          <li *ngFor="let item of list">{{item}}</li>
        </ul>
        <div class="post-footer">
          <button type="button" class="btn btn-default" (click)="bsModalRef.hide()">Close</button>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./commentary-modal.component.scss']
})
export class WeeklyCommentaryModalComponent implements OnInit {
  public title: string;
  public list: any[] = [];

  constructor(public bsModalRef: BsModalRef) {
  }

  ngOnInit() {
    this.title = 'Bear of the Week';
  }
}
