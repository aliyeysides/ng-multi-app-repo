import {Component, OnInit} from '@angular/core';
import {BsModalRef} from 'ngx-bootstrap';

@Component({
  selector: 'cpt-bear-commentary-weekly-modal',
  template: `
    <div class="insights__container insights__container--large insights__container--modal">
      <div class="post-head post-head--bearpick">
        <h2 class="">{{ title }}</h2>
        <div class="divider-h"></div>
        <p class="header__post-date">{{ date }}</p>
        <button type="button" class="post-head__button" aria-label="Close" (click)="bsModalRef.hide()">
          <a class="">
            <i class="fa fa-times-circle" aria-hidden="true"></i>
            <span>&nbsp;Close</span>
          </a>
        </button>
      </div>
      <div class="post-body">
        <div [innerHtml]="commentary"></div>
        <div class="post-footer">
          <button type="button" class="btn btn-default pull-right" (click)="bsModalRef.hide()">Close</button>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./commentary-modal.component.scss']
})
export class WeeklyCommentaryModalComponent implements OnInit {
  public title: string;
  public date: string;
  public list: any[] = [];
  public commentary: string;
  public config = {
    animated: true,
    keyboard: true,
    backdrop: false,
    ignoreBackdropClick: false
  };

  constructor(public bsModalRef: BsModalRef) {
  }

  ngOnInit() {
    this.title = 'Bear of the Week';
  }

}
