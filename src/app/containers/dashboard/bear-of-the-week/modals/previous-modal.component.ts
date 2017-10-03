import {Component, OnInit} from '@angular/core';
import {BsModalRef} from 'ngx-bootstrap';
import {WordpressService} from '../../../../core/services/wordpress.service';
import {Subject} from 'rxjs/Subject';

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
        <ul>
          <li *ngFor="let item of previousPosts">
            {{ item }}
          </li>
        </ul>
      </div>
    </div>
  `
})
export class PreviousBearsModalComponent implements OnInit {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  public title: string;
  public previousPosts: object[];

  constructor(public bsModalRef: BsModalRef,
              private wordpressService: WordpressService) {
  }

  ngOnInit() {
    this.title = 'Previous Picks';
    this.wordpressService.getWordPressJson('48', 7)
      .takeUntil(this.ngUnsubscribe)
      .flatMap(items => {
        console.log('items', items);
        return this.previousPosts = items['0']['48'];
      })
      // .map(post => )

  }
}
