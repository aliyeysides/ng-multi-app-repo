import {Component, OnInit} from '@angular/core';
import {BsModalRef} from 'ngx-bootstrap';

@Component({
  selector: 'cpt-bear-commentary-weekly-modal',
  template: `
    <div class="container-fluid modal-content--bearpick">
      <div class="row no-gutters modal-head modal-head--bearpick">
        <div class="col-8">
          <h2 class="">{{ title }}</h2>
          <p class="header__post-date">{{ date }}</p>
        </div>
        <div class="col-4">
          <button type="button" class="modal-head__button" aria-label="Close" (click)="bsModalRef.hide()">
            <a class="">
              <i class="fa fa-times-circle" aria-hidden="true"></i>
              <span>&nbsp;Close</span>
            </a>
          </button>
        </div>
      </div>
      <div class="row modal-body">
        <div class="col-12" [innerHtml]="commentary"></div>
        <div class="modal-footer">
          <button type="button" class="post-footer__button align-absolute" (click)="bsModalRef.hide()">
            <a><i class="fa fa-long-arrow-left" aria-hidden="true"></i>&nbsp;Close</a>
          </button>
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
