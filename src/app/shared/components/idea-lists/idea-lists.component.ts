import {AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, Output, ViewChild} from '@angular/core';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {FullListModalComponent} from './full-list-modal.component';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Idea, IdeaList} from '../../models/idea';
import {Subject} from 'rxjs/Subject';
import {IDEAS_LIST_CLASSMAP} from '../../models/idea-list-class-map';
import {Subscription} from 'rxjs/Subscription';
import {IdeasService} from '../../../core/services/ideas.service';
import {Router} from '@angular/router';

declare let gtag: Function;

@Component({
  selector: 'cpt-idea-lists',
  template: `
    <div class="idea-lists__component">
      <div class="section-header section-header--ideas">
        <h1>Idea Lists</h1>
        <div class="section-header__actions">
          <a class="long" (click)="openFullList()">List Descriptions <i class="fa fa-long-arrow-right"
                                                                        aria-hidden="true"></i></a>
        </div>
      </div>
      <div (click)="scrollRight()" class="slider__scroll slider__scroll--right">
        <img class="align-absolute" src="./assets/imgs/scroll-r.svg">
      </div>
      <div (click)="scrollLeft()" class="slider__scroll slider__scroll--left">
        <img class="align-absolute" src="./assets/imgs/scroll-l.svg">
      </div>
      <div class="idea-lists__container row no-gutters">
        <ul #list>
          <li
            [ngClass]="{'selected': selectedList.list_id === list.list_id, 'list__option--userlist': list['name'] === 'Holding' || list['name'] === 'Watching' }"
            (click)="emitListSelected(list)"
            *ngFor="let list of lists" class="list__option">
            <ng-container *ngIf="list">
              <div class="list__image">
                <button type="button" class="close">
                  <!--<i class="fa fa-star" aria-hidden="true"></i>-->
                </button>
                <img class="" [src]="'assets/imgs/'+appendListImageUrl(list.name)">
              </div>
              <p class="list__label">{{list.name}}</p>
            </ng-container>
          </li>
        </ul>
      </div>

      <div class="idea-lists__footer row no-gutters">
        <p class="">Idea lists updated daily</p>
      </div>
    </div>
  `,
  styleUrls: ['./idea-lists.component.scss']
})
export class IdeaListsComponent implements AfterViewInit, OnDestroy {
  @ViewChild('list') list: ElementRef;
  @Output('listSelected') listSelected: EventEmitter<IdeaList> = new EventEmitter<IdeaList>();

  @Input('lists')
  set lists(lists: object[]) {
    this._lists.next(lists);
  }

  get lists() {
    return this._lists.getValue();
  }

  private _lists: BehaviorSubject<object[]> = new BehaviorSubject<object[]>([]);
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  public fullListModalRef: BsModalRef;
  public selectedList: IdeaList;
  public loading: Subscription;
  public classMap = IDEAS_LIST_CLASSMAP;
  public config = {
    animated: true,
    keyboard: true,
    backdrop: false,
    ignoreBackdropClick: false,
    class: 'modal-dialog--fullscreen',
  };
  public left: number;

  constructor(private modalService: BsModalService,
              private ideasService: IdeasService,
              private router: Router) {
  }

  ngAfterViewInit() {
    this.ideasService.selectedList
      .takeUntil(this.ngUnsubscribe)
      .subscribe(list => {
        this.selectedList = list;
      });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public openFullList() {
    this.fullListModalRef = this.modalService.show(FullListModalComponent, this.config);
  }

  public scrollRight() {
    this.left = this.list.nativeElement.scrollLeft;
    this.list.nativeElement.scrollTo({left: this.left+=110, top: 0, behavior: 'smooth'});
  }

  public scrollLeft() {
    this.left = this.list.nativeElement.scrollLeft;
    this.list.nativeElement.scrollTo({left: this.left-=110, top: 0, behavior: 'smooth'});
  }

  public emitListSelected(list: IdeaList) {
    this.selectedList = list;
    this.ideasService.setSelectedList(list);
    this.router.navigate(['/ideas']);
    gtag('event', 'list_clicked', {
      'event_category': 'engagement',
      'event_label': list['name'],
      'list_id': list['list_id']
    });
  }

  public appendListImageUrl(listName: string) {
    return this.classMap[listName] ? this.classMap[listName].imgName : '/img_list-classicbears.svg';
  }

}
