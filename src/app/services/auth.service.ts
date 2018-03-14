import {Injectable} from '@angular/core';
import {UtilService} from './util.service';
import {Observable} from 'rxjs/Observable';
import {User} from '../shared/models/user';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {HttpClient} from "@angular/common/http";
import {Http, URLSearchParams} from '@angular/http';

@Injectable()
export class AuthService {

  private apiHostName: string = this.utilService.getApiHostName();

  private currentUser: BehaviorSubject<User> = new BehaviorSubject<User>({} as User);
  currentUser$ = this.currentUser.asObservable();

  private _userLists: BehaviorSubject<object[]> = new BehaviorSubject<object[]>({} as object[]);

  public loggedIn: boolean;

  private loginParams: URLSearchParams;

  constructor(private utilService: UtilService,
              private httpClient: HttpClient,
              private http: Http) {
    this.loginParams = new URLSearchParams;
  }

  public setCurrentUser(usr: User) {
    console.log('setCurrentUser', usr);
    this.currentUser.next(usr);
  }

  set userLists(lists: object[]) {
    this._userLists.next(lists);
  }

  get userLists() {
    return this._userLists.getValue();
  }

  public login(): Observable<any> {
    const email = localStorage.getItem('email');
    const getLoginUrl = `${this.apiHostName}/CPTRestSecure/app/user/login?`;
    const options = {
      params: {
        'deviceId': email
      },
      withCredentials: true,
    };

    return this.httpClient.get(getLoginUrl, options).map((res: Response) => {
      console.log('res', res);
      this.loggedIn = true;
      return res;
    }).catch(res => {
      console.log('onrejected', res);
      return this.utilService.handleError(res);
    });
  }
  //
  // public login(): Observable<any> {
  //   const email = localStorage.getItem('email');
  //   const getLoginUrl = `${this.apiHostName}/CPTRestSecure/app/user/login?`;
  //   this.loginParams.set('deviceId', email);
  //   return this.http.get(getLoginUrl, {
  //     search: this.loginParams,
  //     withCredentials: true
  //   }).map(res => {
  //     this.loggedIn = true;
  //     return res.json();
  //   })
  //     .catch(this.utilService.handleError);
  // }

  public logOutSession(): Observable<any> {
    const getLogoutUrl = `${this.apiHostName}/CPTRestSecure/app/session/killsessions?`;
    return this.http.get(getLogoutUrl, {withCredentials: true}).map(() => {
      this.loggedIn = false;
      window.location.href = this.apiHostName;
    }).catch(this.utilService.handleError);
  }

  public isLoggedIn(): boolean {
    return this.loggedIn ? this.loggedIn : false;
  }

}
