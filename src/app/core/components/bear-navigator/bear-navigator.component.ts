import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'cpt-bear-navigator',
  template: `
    <ul>
      <li *ngFor="let route of routes"
          routerLinkActive="active">
        <a routerLink="{{ route.link }}">
          <i class="{{ route.icon }}"></i>
          <span class="text">{{ route.label }}</span>
        </a>
      </li>
    </ul>
  `,
  styleUrls: ['./bear-navigator.component.scss']
})
export class BearNavigatorComponent implements OnInit {

  public routes = [
    {link: '/', icon: '', label: 'Home'},
    {link: '/ideas', icon: '', label: 'Stock Ideas'},
    {link: '/discovery', icon: '', label: 'Stock Discovery'},
    {link: '/report', icon: '', label: 'Stock View'}
  ];

  constructor() {
  }

  ngOnInit() {
  }

}
