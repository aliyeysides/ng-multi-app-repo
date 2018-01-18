import {Injectable, OnDestroy} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Subject} from 'rxjs/Subject';
import {AuthService} from '../../services/auth.service';
import {UtilService} from '../../services/util.service';

@Injectable()
export class AuthGuard implements CanActivate, OnDestroy {
  protected ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(public authService: AuthService,
              public router: Router,
              public utilService: UtilService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (!this.authService.isLoggedIn()) {
      this.authService.login()
        .takeUntil(this.ngUnsubscribe)
        .subscribe(user => {
            this.authService.setCurrentUser(user);
            this.router.navigate([state.url]);
          },
          err => {
            this.utilService.handleError(err);
            window.location.href = this.utilService.getApiHostName();
          });
    }
    return this.authService.isLoggedIn();
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
