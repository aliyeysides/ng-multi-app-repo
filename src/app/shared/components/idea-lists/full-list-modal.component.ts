import {Component, OnDestroy, OnInit} from '@angular/core';
import {BsModalRef} from 'ngx-bootstrap';
import {Subscription} from 'rxjs/Subscription';
import {IdeasService} from '../../../core/services/ideas.service';
import {Subject} from 'rxjs/Subject';
import {IDEAS_LIST_CLASSMAP} from '../../models/idea-list-class-map';
import {WordpressService} from '../../../core/services/wordpress.service';
import {Router} from '@angular/router';

interface SelectedList {
  name?: string;
  tagline?: string;
  more?: string;
  how?: string;
}

@Component({
  selector: 'cpt-full-list-modal',
  template: `
    <div [ngBusy]="loading" class="insights__container insights__container--large insights__container--modal">
      <div class="post-head post-head--bearpick">
        <h2 class="">{{ title }}</h2>
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
              <li (click)="selectList(list)" *ngFor="let list of allLists" class="list__option" [ngClass]="{'selected':selectedList===list}">
                <div class="list__image">
                  <img src="assets/imgs/{{ appendListImageUrl(list?.name) }}">
                </div>
                <p class="list__label">{{ list['name'] }}</p>
              </li>
            </ul>
          </div>
          <div class="idea-list__right-col col-sm-6 col-md-7 col-lg-8 col-xl-8">
            <div class="idea-list__descriptions">
              <div class="list-description__header">
                <img src="assets/imgs/{{ appendListColoredImageUrl(selectedList?.name) }}">
                <h3>{{ selectedList ? selectedList['name'] : 'Select a List to learn more...' }}</h3>
                <a (click)="viewList(selectedList)" class="post-head__button">
                  <i class="fa fa-external-link-square" aria-hidden="true"></i>
                  <span>&nbsp;View List</span>
                </a>
              </div>
              <div class="list-description__body">
                <div class="body__section">
                  <h6>What is this list?</h6>
                  <p>{{ selectedList?.tagline }}</p>
                  <p>{{ selectedList?.more }}</p>
                </div>
                <div class="body__section">
                  <h6>How should I use this list?</h6>
                  <p>{{ selectedList?.how }}</p>
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

  public list: any;
  public title: string;
  public allLists: object[];
  public selectedList: SelectedList;
  public wordPressPosts: object[];
  public classMap = IDEAS_LIST_CLASSMAP;
  public loading: Subscription;

  constructor(public bsModalRef: BsModalRef,
              private router: Router,
              private wordpressService: WordpressService,
              private ideasService: IdeasService) {
  }

  ngOnInit() {
    this.title = 'Idea List Descriptions';
    this.ideasService.getIdeasList('1051819', 'Bear')
      .takeUntil(this.ngUnsubscribe)
      .filter(x => x != undefined)
      .subscribe(res => {
        this.allLists = res[0]['idea_lists'].concat(res[1]['theme_lists']);
        this.getWordPressPostListDescriptions();
      });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public appendListImageUrl(listName: string) {
    return this.classMap[listName] ? this.classMap[listName].imgName : '/img_list-classicbears.svg';
  }

  public appendListColoredImageUrl(listName: string) {
    return this.classMap[listName] ? this.classMap[listName].coloredImgName : '/img_list-classicbears--red.svg';
  }

  public selectList(list: object) {
    this.selectedList = list;
    const matchingPost = this.wordPressPosts.filter(post => post['post_title'] === this.selectedList['name']);
    const htmlStr = matchingPost[0]['post_content'];
    this.parseDomString(htmlStr);
  }

  public viewList(list) {
    this.ideasService.setSelectedList(list);
    this.bsModalRef.hide();
    this.router.navigate(['/ideas']);
  }

  private parseDomString(str: string) {
    const parser = new DOMParser();
    const dom = parser.parseFromString(str, 'text/html');
    Object.assign(this.selectedList, { tagline: dom.getElementById('tagline').innerText });
    Object.assign(this.selectedList, { more: dom.getElementById('more').innerText });
    Object.assign(this.selectedList, { how: dom.getElementById('how').innerText });
  }

  private getWordPressPostListDescriptions() {
    this.wordpressService.getWordPressJson('45', this.allLists.length)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(val => {
        this.wordPressPosts = val['0']['45'];
        this.selectList(this.allLists[0]);
      });
  }

}
