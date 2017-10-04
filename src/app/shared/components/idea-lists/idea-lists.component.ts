import {AfterViewInit, Component, EventEmitter, Input, Output} from '@angular/core';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {FullListModalComponent} from './full-list-modal.component';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {IdeaList} from '../../models/idea';
import {Subject} from 'rxjs/Subject';

@Component({
  selector: 'cpt-idea-lists',
  template: `
    <div class="idea-lists__component container-fluid">
      <div class="idea-lists__header row no-gutters">
        <h1>Idea Lists</h1>
        <div class="divider-h"></div>
        <a (click)="openFullList()">See List Descriptions <i class="fa fa-long-arrow-right" aria-hidden="true"></i></a>
      </div>
      <div class="idea-lists__container row no-gutters">
        <ul class="">
          <li (click)="emitListSelected(list)" *ngFor="let list of lists" class="list__option">
            <div class="list__image">
              <button type="button" class="close">
                <i class="fa fa-star" aria-hidden="true"></i>
              </button>
              <img class="" src="./assets/imgs/img_list-classicbears.svg">
            </div>
            <p class="list__label">{{list.name}}</p>
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
      .subscribe(lists => console.log('lists', lists));
  }

  public openFullList() {
    this.fullListModalRef = this.modalService.show(FullListModalComponent, this.config);
  }

  public emitListSelected(list: IdeaList) {
    this.listSelected.emit(list);
  }

}
