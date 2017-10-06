import {AfterViewInit, Component, EventEmitter, Input, Output} from '@angular/core';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {FullListModalComponent} from './full-list-modal.component';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {IdeaList} from '../../models/idea';
import {Subject} from 'rxjs/Subject';
import {ClassMap, IDEAS_LIST_CLASSMAP} from '../../models/idea-list-class-map';

@Component({
  selector: 'cpt-idea-lists',
  template: `
    <div class="idea-lists__component">
      <div class="section-header section-header--ideas">
        <h1>Idea Lists</h1>
        <div class="section-header__actions">
          <a class="long" (click)="openFullList()"><i class="fa fa-list-ul" aria-hidden="true"></i> List Descriptions</a>
        </div>
      </div>
      <div class="idea-lists__container row no-gutters">
        <ul class="">
          <li [ngClass]="{'selected': selectedList === list}" (click)="emitListSelected(list)"
              *ngFor="let list of lists" class="list__option">
            <ng-container *ngIf="list.is_active">
              <div class="list__image">
                <button type="button" class="close">
                  <i class="fa fa-star" aria-hidden="true"></i>
                </button>
                <img class="" [src]="'assets/imgs/'+classMap[list.name].imgName">
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
export class IdeaListsComponent implements AfterViewInit {
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
  public classMap = IDEAS_LIST_CLASSMAP;
  public config = {
    animated: true,
    keyboard: true,
    backdrop: false,
    ignoreBackdropClick: false,
    class: 'modal-dialog--fullscreen',
  };

  constructor(private modalService: BsModalService) {
  }

  ngAfterViewInit() {
    this._lists
      .takeUntil(this.ngUnsubscribe)
      .filter(x => x !== undefined)
      .subscribe(lists => this.emitListSelected(lists[0] as IdeaList));
  }

  public openFullList() {
    this.fullListModalRef = this.modalService.show(FullListModalComponent, this.config);
  }

  public emitListSelected(list: IdeaList) {
    this.selectedList = list;
    this.listSelected.emit(list);
  }

}
