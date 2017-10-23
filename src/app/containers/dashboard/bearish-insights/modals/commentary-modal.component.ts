import {Component, OnInit} from '@angular/core';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {PreviousInsightsModalComponent} from './previous-modal.component';

@Component({
  selector: 'cpt-bear-commentary-insights-modal',
  template: `
    <div class="insights__container insights__container--large insights__container--modal">
      <div class="post-head post-head--insights">
        <h2 class="">Mastering the Bear</h2>
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
        <div class="post-body post-body--insights">
          <div [innerHtml]="commentary"></div>
          <div class="post-footer">
            <button type="button" class="post-footer__button" (click)="bsModalRef.hide()">
              <a><i class="fa fa-long-arrow-left" aria-hidden="true"></i>&nbsp;Close</a>
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./commentary-modal.component.scss']
})
export class InsightsCommentaryModalComponent implements OnInit {
  public title: string;
  public list: any[] = [];
  public date: string;
  public commentary: string;
  public config = {
    animated: true,
    keyboard: true,
    backdrop: false,
    ignoreBackdropClick: false,
  };

  constructor(public bsModalRef: BsModalRef) {
  }

  ngOnInit() {
  }

}
