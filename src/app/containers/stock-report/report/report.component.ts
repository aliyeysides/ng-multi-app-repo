import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Location} from '@angular/common';
import {SafeUrl} from '@angular/platform-browser';

@Component({
  selector: 'cpt-report',
  template: `
    <div>
      <iframe #iframe class="stock-view__iframe" id="iframeId" [src]="src"
              (load)="src ? onLoad() : null"></iframe>
    </div>
  `,
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {
  @ViewChild('iframe') iframe: ElementRef;
  @Output('loadFinished') loadFinished: EventEmitter<null> = new EventEmitter<null>();
  @Input('src') src = <SafeUrl>null;

  constructor(private location: Location) {
  }

  ngOnInit() {
  }

  goBack() {
    this.location.back();
  }

  onLoad() {
    this.loadFinished.emit();
    const iframe = this.iframe.nativeElement;
    const doc = iframe.contentDocument || (<HTMLIFrameElement>iframe).contentWindow;
  }


}
