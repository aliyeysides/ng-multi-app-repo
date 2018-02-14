import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {WordpressService} from '../../../services/wordpress.service';
import {IdeasService} from '../../../services/ideas.service';

declare let gtag: Function;

@Component({
  selector: 'cpt-bear-navigator',
  template: `
    <div class="side-nav">
      <div class="side-nav__rule">
        <p>&ndash;&ndash;&ndash;&nbsp; NAVIGATION
          &nbsp;&ndash;&ndash;&ndash;&ndash;&ndash;&ndash;&ndash;&ndash;&ndash;&ndash;&ndash;</p>
      </div>
      <ul class="side-nav__section">
        <li *ngFor="let route of siteRoutes"
            routerLinkActive="active"
            routerLink="{{ route.link }}">
          <a>
            <img src="{{ route.icon }}">
            <span class="text">{{ route.label }}</span>
          </a>
        </li>
      </ul>
      <div class="side-nav__rule">
        <p>&ndash;&ndash;&ndash;&nbsp; EDUCATION
          &nbsp;&ndash;&ndash;&ndash;&ndash;&ndash;&ndash;&ndash;&ndash;&ndash;&ndash;&ndash;</p>
      </div>
      <ul class="side-nav__section">
        <li *ngFor="let route of eduRoutes">
          <a target="{{ route.target }}" href="{{ route.link }}">
            <img src="{{ route.icon }}">
            <span class="text">{{ route.label }}</span>
          </a>
        </li>
      </ul>
    </div>
  `,
  styleUrls: ['./bear-navigator.component.scss']
})
export class BearNavigatorComponent implements OnInit {

  public bearOfTheWeekSymbol: string;
  public siteRoutes = [
    {link: '/dashboard', icon: './assets/imgs/icon_home.svg', label: 'Home'},
    {link: '/ideas', icon: './assets/imgs/icon_bulb.svg', label: 'Stock Ideas'},
    {link: '/discovery/' + 'AAPL', icon: './assets/imgs/icon_discovery.svg', label: 'Discovery'},
    {link: '/report/' + 'AAPL', icon: './assets/imgs/icon_stockview.svg', label: 'Stock View'}
  ];
  public eduRoutes = [
    {
      label: 'Power Gauge',
      icon: './assets/imgs/icon_aboutPGR.svg',
      link: 'https://masteringthebear.com/user-guide/',
      target: '_blank',
      fn: () => {
        gtag('event', 'pgr_education_clicked', {'event_category': 'engagement'});
      }
    },
    {
      label: 'Education',
      icon: './assets/imgs/icon_education.svg',
      link: 'https://masteringthebear.com/education',
      target: '_blank',
      fn: () => {
        gtag('event', 'pgr_education_clicked', {'event_category': 'engagement'});
      }
    }
  ];

  constructor(private wordpressService: WordpressService,
              private ideasService: IdeasService) {
  }

  ngOnInit() {
    this.ideasService.selectedStock$.subscribe(res => {
      if (res != '') {
        this.siteRoutes = [
          {link: '/dashboard', icon: './assets/imgs/icon_home.svg', label: 'Home'},
          {link: '/ideas', icon: './assets/imgs/icon_bulb.svg', label: 'Stock Ideas'},
          {
            link: '/discovery/' + res,
            icon: './assets/imgs/icon_discovery.svg',
            label: 'Discovery'
          },
          {link: '/report/' + res, icon: './assets/imgs/icon_stockview.svg', label: 'Stock View'}
        ];
        return;
      }
      return this.wordpressService.getWordPressJson('48', 1)
        .take(1)
        .filter(x => x !== undefined)
        .flatMap(res => Observable.of(res['0']['48'][0]))
        .map(post => this.wordpressService.getInsightPostTicker(post))
        .subscribe(ticker => {
          this.bearOfTheWeekSymbol = ticker.trim();
          if (this.bearOfTheWeekSymbol) {
            this.siteRoutes = [
              {link: '/dashboard', icon: './assets/imgs/icon_home.svg', label: 'Home'},
              {link: '/ideas', icon: './assets/imgs/icon_bulb.svg', label: 'Stock Ideas'},
              {
                link: '/discovery/' + this.bearOfTheWeekSymbol,
                icon: './assets/imgs/icon_discovery.svg',
                label: 'Discovery'
              },
              {link: '/report/' + this.bearOfTheWeekSymbol, icon: './assets/imgs/icon_stockview.svg', label: 'Stock View'}
            ];
          }
        });
    });
  }

}
