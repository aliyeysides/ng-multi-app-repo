import {Injectable, OnDestroy} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import {UtilService} from '../../services/util.service';
import {AuthGuard} from './auth.guard';
import {HealthCheckService} from '../../services/health-check.service';

@Injectable()
export class PspAuthGuard extends AuthGuard implements CanActivate, OnDestroy {

  constructor(public authService: AuthService,
              public router: Router,
              public utilService: UtilService,
              private healthCheck: HealthCheckService) {
    super(authService, router, utilService)
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (!this.authService.isLoggedIn()) {
      this.authService.login()
        .takeUntil(this.ngUnsubscribe)
        .do(user => this.authService.setCurrentUser(user))
        .switchMap(user => this.healthCheck.getAuthorizedLists(user['UID']))
        .subscribe(res => {
            this.authService.userLists = res;
            this.router.navigate([state.url]);
          },
          err => {
            this.utilService.handleError(err);
            window.location.href = this.utilService.getApiHostName();
          });
    }
    return this.authService.isLoggedIn();
  }
}
