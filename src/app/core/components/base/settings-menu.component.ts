import {ElementRef, HostListener, ViewChild} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {AuthService} from '../../services/auth.service';

declare let gtag: Function;

export class BaseSettingsMenuComponent {
  @ViewChild('nav') nav;

  @HostListener('click', ['$event']) onClick(e?: Event) {
    if (e) e.stopPropagation();
    this.toggleNav(this.nav.nativeElement, '500px', true);
  }

  @HostListener('document:click', ['$event']) offClick(e: Event) {
    if (!this.el.nativeElement.contains(e.target)) this.toggleNav(this.nav.nativeElement, '0', false);
  }

  public items: object[];

  protected ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(public el: ElementRef,
              public authService: AuthService) {
  }

  public toggleNav(el: HTMLElement, size: string, darken: boolean): void {
    el.style.width = size;
    if (darken === true) {
      document.getElementById('settings-darken').style.visibility = 'visible';
    } else if (darken === false) {
      document.getElementById('settings-darken').style.visibility = 'hidden';
    }
  }

  public logOutSession(): void {
    gtag('event', 'logout_clicked');
    this.authService.logOutSession()
      .takeUntil(this.ngUnsubscribe)
      .subscribe();
  }
}
