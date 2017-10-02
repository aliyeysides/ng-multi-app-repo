import {Component, OnInit} from '@angular/core';
import {IdeasService} from '../../core/services/ideas.service';
import {Subject} from 'rxjs/Subject';

@Component({
  selector: 'cpt-ideas',
  template: `
    <div class="ideas">
      <cpt-idea-lists [lists]=""></cpt-idea-lists>
      <cpt-list-view></cpt-list-view>
    </div>
  `,
  styleUrls: ['./ideas.component.scss']
})
export class IdeasComponent implements OnInit {
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private ideasService: IdeasService) {
  }

  ngOnInit() {
    this.ideasService.getIdeasList()
      .takeUntil(this.ngUnsubscribe)
      .reduce((acc, lists, idx) => {
        console.log('reduce', acc, lists, idx);
        return acc;
      })
      .subscribe(res => {
        // Object.assign({}, res)
        console.log('res', res)
      });
  }

}
