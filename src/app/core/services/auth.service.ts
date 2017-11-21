import {Injectable} from '@angular/core';
import {Http, URLSearchParams} from '@angular/http';
import {UtilService} from './util.service';
import {Observable} from 'rxjs/Observable';
import {User} from '../../shared/models/user';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {IdeasService} from './ideas.service';

@Injectable()
export class AuthService {

  private apiHostName: string = this.utilService.getApiHostName();

  private currentUser: BehaviorSubject<User> = new BehaviorSubject<User>({} as User);
  currentUser$ = this.currentUser.asObservable();

  private loginParams: URLSearchParams;
  public loggedIn: boolean;


  constructor(private utilService: UtilService,
              private http: Http) {
    this.loginParams = new URLSearchParams;
  }

  public setCurrentUser(usr: User) {
    this.currentUser.next(usr);
  }

  public login(): Observable<any> {
    const email = localStorage.getItem('email');
    const getLoginUrl = `${this.apiHostName}/CPTRestSecure/app/user/login?`;
    this.loginParams.set('deviceId', email);
    return this.http.get(getLoginUrl, {
      search: this.loginParams,
      withCredentials: true
    }).map(res => {
      this.loggedIn = true;
      return res.json();
    })
      .catch(this.utilService.handleError);
  }

  public logOutSession(): Observable<any> {
    const getLogoutUrl = `${this.apiHostName}/CPTRestSecure/app/session/killsessions?`;
    return this.http.get(getLogoutUrl, {
      search: this.loginParams,
      withCredentials: true
    }).map(() => {
      this.loggedIn = false;
      window.location.href = this.apiHostName;
    })
      .catch(this.utilService.handleError);
  }

  public isLoggedIn(): boolean {
    return this.loggedIn;
  }

  // public getBearHoldingListId() {
  //   // const uid = this.currentUser.getValue()['UID'];
  //   // this.ideasService.getIdeasList(uid, 'Bear')
  //   //   .take(1)
  //   //   .subscribe(res => {
  //   //     this.holdingListId = res[2]['user_lists'][0]['list_id'];
  //   //     this.watchingListId = res[2]['user_lists'][1]['list_id'];
  //   //   });
  // }
  //
  // public getBearWatchingListId() {
  //   console.log('watchinglistId', this.currentUser.getValue());
  // }

}
