import {Component, OnInit, TemplateRef} from '@angular/core';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';

@Component({
  selector: 'cpt-previous-modal',
  template: `
    <div class="modal-header">
      <h4 class="modal-title pull-left">{{title}}</h4>
      <button type="button" class="close pull-right" aria-label="Close" (click)="noop()">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
      <ul *ngIf="list.length">
        <li *ngFor="let item of list">{{item}}</li>
      </ul>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-default" (click)="noop()">Close</button>
    </div>
  `,
  styleUrls: ['./previous-modal.component.scss']
})
export class PreviousModalComponent implements OnInit {
  public modalRef: BsModalRef;
  public title: string;
  public list: any[] = ['test', '1', '2'];
  constructor(public modalService: BsModalService) {}

  ngOnInit() {
  }

  noop() {
    //
  }

  public openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

}
