import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {UtilService} from './util.service';

@Injectable()
export class IdeasService {

  private apiHostName = this.utilService.getApiHostName();
  private ideaListParams: URLSearchParams;

  constructor(private utilService: UtilService) {
    this.ideaListParams = new URLSearchParams();
  }

  public getIdeasList(): Observable<Array<object>> {
    // const uid = this.currentUser['UID'];
    const uid = '1024494';
    const ideaListLookupUrl = `${this.apiHostName}/CPTRestSecure/app/portfolio/getMidTierUserLists?`;
    this.ideaListParams.set('uid', uid);
    return this.utilService.getJson(ideaListLookupUrl, this.ideaListParams);
  }

}
