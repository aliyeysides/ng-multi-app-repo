import {Component, OnDestroy, OnInit} from '@angular/core';
import {BsModalRef} from 'ngx-bootstrap';
import {Subscription} from 'rxjs/Subscription';
import {AuthService} from '../../../core/services/auth.service';
import {IdeasService} from '../../../core/services/ideas.service';
import {WordpressService} from '../../../core/services/wordpress.service';
import {Subject} from 'rxjs/Subject';

@Component({
  selector: 'cpt-full-list-modal',
  template: `
    <div [ngBusy]="loading" class="insights__container insights__container--large insights__container--modal">
      <div class="post-head post-head--bearpick">
        <h2 class="">{{title}}</h2>
        <button type="button" class="post-head__button" aria-label="Close" (click)="bsModalRef.hide()">
          <a class="">
            <i class="fa fa-times-circle" aria-hidden="true"></i>
            <span>&nbsp;Close</span>
          </a>
        </button>
      </div>
      <div class="post-body">
        <div class="idea-list__container row no-gutters">
          <div class="idea-list__left-col col-sm-6 col-md-5 col-lg-4 col-xl-4">
            <ul class="idea-list__list">
              <li *ngFor="let list of allLists" class="list__option selected">
                <div class="list__image">
                  <img class="" src="./assets/imgs/img_list-classicbears.svg">
                </div>
                <p class="list__label">{{ list.name }}</p>
              </li>
            </ul>
          </div>
          <div class="idea-list__right-col col-sm-6 col-md-7 col-lg-8 col-xl-8">
            <div class="idea-list__descriptions">
              <div class="list-description__header">
                <img src="./assets/imgs/img_list-classicbears--color.svg">
                <h3>Best Bear Ideas</h3>
                <a class="post-head__button">
                  <i class="fa fa-external-link-square" aria-hidden="true"></i>
                  <span>&nbsp;View List</span>
                </a>
              </div>
              <div class="list-description__body">
                <div class="body__section">
                  <h6>What is this list?</h6>
                  <p>Mauris at tellus sed justo aliquet malesuada. Morbi cursus elit sit amet sem consequat, eget
                    bibendum magna venenatis. Pellentesque habitant morbi tristique senectus et netus et malesuada fames
                    ac turpis egestas.</p>

                  <p>Fusce dui lorem, aliquet sit amet lectus vulputate, sollicitudin ultrices nulla. Donec pharetra
                    arcu sed auctor pretium. Etiam ac elementum lacus. Mauris consequat neque non pellentesque
                    aliquam.</p>
                </div>
                <div class="body__section">
                  <h6>How should I use this list?</h6>
                  <p>Pellentesque ornare tristique feugiat. Duis dictum congue sodales. Integer sagittis porttitor nisi,
                    at faucibus eros sollicitudin non.</p>

                  <p>Etiam vel neque a enim pulvinar faucibus. Duis sollicitudin nisl odio, viverra consectetur elit
                    fringilla eget. </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./full-list-modal.component.scss']
})
export class FullListModalComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private uid: string;
  private totalListAmount: number;

  public title: string;
  public allLists: object[];
  public wordPressPosts: object[];
  public loading: Subscription;

  constructor(public bsModalRef: BsModalRef,
              private authService: AuthService,
              private wordpressService: WordpressService,
              private ideasService: IdeasService) {
  }

  ngOnInit() {
    this.title = 'Idea List Descriptions';
    debugger;
    this.loading = this.authService.currentUser$
      .map(usr => this.uid = usr['UID'])
      .flatMap(uid => this.ideasService.getIdeasList(uid, 'Bear'))
      .filter(x => x !== undefined)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(res => {
        this.allLists = res[2]['user_lists'].concat(res[0]['idea_lists']).concat(res[1]['theme_lists']);
        console.log('allLists', this.allLists);
      });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private getWordPressPostListDescriptions() {
    this.wordpressService.getWordPressJson('45', this.totalListAmount)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(val => this.wordPressPosts = val['0']['45']);
  }


}
