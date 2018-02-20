import {Injectable} from '@angular/core';
import {UtilService} from './util.service';
import {DatePipe} from '@angular/common';

@Injectable()
export class WordpressService {
  private apiHostName = this.utilService.getApiHostName();

  constructor(private utilService: UtilService,
              private datePipe: DatePipe) {
  }

  public getInsightPostDom(post: object): Document {
    const parser = new DOMParser();
    return parser.parseFromString(post['post_content'], 'text/html');
  }

  public getInsightPostBody(post: object): string {
    const dom = this.getInsightPostDom(post);
    return dom.body.innerHTML;
  }

  public getInsightPostTicker(post: object): string {
    const dom = this.getInsightPostDom(post);
    return dom.getElementById('ticker') ? dom.getElementById('ticker').innerHTML.trim()
      : dom.body.getElementsByClassName('ticker')[0].innerHTML.trim();
  }

  public assignAuthorProp(postArr: object[]): void {
    postArr.map(post => {
      const dom = this.getInsightPostDom(post);
      const ref = dom.getElementById('author');
      if (ref) {
        const author = ref.innerText;
        return Object.assign(post, {author: author})
      }
    });
  }

  // TODO: Add assignAuthorProp once we get market insights 'author' id
  public assignWordPressDateProperties(postArr: object[]): void {
    this.assignWordPressParsedDate(postArr);
    this.assignWordPressFormattedDate(postArr);
  }

  public assignWordPressParsedDate(postArr: object[]): void {
    postArr.map(post => {
      const date = post['post_date'];
      const parsedDate = Date.parse(date);
      return Object.assign(post, {post_date_parsed: parsedDate});
    });
  }

  public assignWordPressFormattedDate(postArr: object[]): void {
    postArr.map(post => {
      const parsedDate = post['post_date_parsed'];
      const formattedDate = this.datePipe.transform(parsedDate, 'shortDate');
      return Object.assign(post, {post_date_formatted: formattedDate});
    })
  }

  public getWordPressJson(id: string, count: number) {
    const insightsUrl = `${this.apiHostName}/insights/?json=secursive.get_product_updates&dev=1`;
    const params = {
      'id': id,
      'count': count.toString()
    };
    return this.utilService.getJson(insightsUrl, { params, withCredentials: true });
  }

}
