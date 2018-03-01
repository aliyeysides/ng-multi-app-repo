import 'rxjs/add/operator/do';
import {
  HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest,
  HttpResponse
} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {AuthService} from '../../services/auth.service';
import {Injectable} from '@angular/core';
import {UtilService} from '../../services/util.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(public auth: AuthService, private utilService: UtilService) {
    console.log('constructor');
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('request:', request, 'next:', next);
    return next.handle(request).do((event: HttpEvent<any>) => {
      console.log('event', event);
      if (event instanceof HttpResponse) {
        // do stuff with response if you want
      }
    }, (err: any) => {
      if (err instanceof HttpErrorResponse) {
        console.log('instanceof Error res');
        if (err.status === 401 || err.status === 403) {
          // redirect to the login route
          // or show a modal
          console.log('logout');
          window.location.href = this.utilService.getApiHostName();
        }
      }
    }).catch((err) => {
      console.log('err', err);
      return Observable.throw(err);
    });
  }
}
