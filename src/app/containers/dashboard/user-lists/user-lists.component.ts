import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'cpt-user-lists',
  template: `
    <div class="insights__container insights__container--list">
      <div class="post-head post-head--userlist">
        <div class="clearfix">
          <h4><a class="active">Holding</a> <span class="divider-toggle">|</span> <a class="">Watching</a></h4>
          <a class="post-head__button">
            <i class="fa fa-external-link-square" aria-hidden="true"></i>
             <span>&nbsp;View List</span>
          </a>          
          <a class="post-head__button">
            <i class="fa fa-plus-circle" aria-hidden="true"></i>
             <span>&nbsp;Add Stock</span>
          </a>
        </div>
        <div class="col-header__container row no-gutters">
          <div class="col-header col-2">Rating</div>
          <div class="col-header col-header--ticker col-3">Ticker</div>
          <div class="col-header col-1"></div>
          <div class="col-header col-3">Last Price</div>
          <div class="col-header col-3">% Chg</div>
        </div>
      </div>
      <ul class="post-body post-body--userlist">
        <li class="row no-gutters">
          <div class="col-2 stock__PGR">
            <img class="align-absolute" src="../../assets/imgs/arc_VeryBullish.svg">
          </div>
          <div class="col-3 stock__ticker">
            <p class="ticker">CMCSA</p>
          </div>
          <div class="col-1 stock__alert">
            <i class="fa fa-bell up-change" aria-hidden="true"></i>
          </div>
          <div class="col-3 stock__price">
            <p class="data up-change">$455.55</p>
          </div>
          <div class="col-3 stock__price">
            <p class="data up-change">+10.54%</p>
          </div>
        </li>
        <li class="row no-gutters">
          <div class="col-2 stock__PGR">
            <img class="align-absolute" src="../../assets/imgs/arc_VeryBullish.svg">
          </div>
          <div class="col-3 stock__ticker">
            <p class="ticker">T</p>
          </div>
          <div class="col-1 stock__alert">
          </div>
          <div class="col-3 stock__price">
            <p class="data down-change">$356.77</p>
          </div>
          <div class="col-3 stock__price">
            <p class="data down-change">-3.33%</p>
          </div>
        </li>
        <li class="row no-gutters">
          <div class="col-2 stock__PGR">
            <img class="align-absolute" src="../../assets/imgs/arc_Bearish.svg">
          </div>
          <div class="col-3 stock__ticker">
            <p class="ticker">YUM</p>
          </div>
          <div class="col-1 stock__alert">
          </div>
          <div class="col-3 stock__price">
            <p class="data up-change">$76.28</p>
          </div>
          <div class="col-3 stock__price">
            <p class="data up-change">+1.01%</p>
          </div>
        </li>
        <li class="row no-gutters">
          <div class="col-2 stock__PGR">
            <img class="align-absolute" src="../../assets/imgs/arc_VeryBullish.svg">
          </div>
          <div class="col-3 stock__ticker">
            <p class="ticker">AMZN</p>
          </div>
          <div class="col-1 stock__alert">
            <i class="fa fa-bell down-change" aria-hidden="true"></i>
          </div>
          <div class="col-3 stock__price">
            <p class="data down-change">$554.32</p>
          </div>
          <div class="col-3 stock__price">
            <p class="data down-change">-2.99%</p>
          </div>
        </li>
        <li class="row no-gutters">
          <div class="col-2 stock__PGR">
            <img class="align-absolute" src="../../assets/imgs/arc_VeryBearish.svg">
          </div>
          <div class="col-3 stock__ticker">
            <p class="ticker">CMCSA</p>
          </div>
          <div class="col-1 stock__alert">
            <i class="fa fa-bell up-change" aria-hidden="true"></i>
          </div>
          <div class="col-3 stock__price">
            <p class="data up-change">$455.55</p>
          </div>
          <div class="col-3 stock__price">
            <p class="data up-change">+10.54%</p>
          </div>
        </li>
        <li class="row no-gutters">
          <div class="col-2 stock__PGR">
            <img class="align-absolute" src="../../assets/imgs/arc_VeryBearish.svg">
          </div>
          <div class="col-3 stock__ticker">
            <p class="ticker">CMCSA</p>
          </div>
          <div class="col-1 stock__alert">
            <i class="fa fa-bell up-change" aria-hidden="true"></i>
          </div>
          <div class="col-3 stock__price">
            <p class="data up-change">$455.55</p>
          </div>
          <div class="col-3 stock__price">
            <p class="data up-change">+10.54%</p>
          </div>
        </li>
        <li class="row no-gutters">
          <div class="col-2 stock__PGR">
            <img class="align-absolute" src="../../assets/imgs/arc_VeryBearish.svg">
          </div>
          <div class="col-3 stock__ticker">
            <p class="ticker">CMCSA</p>
          </div>
          <div class="col-1 stock__alert">
            <i class="fa fa-bell up-change" aria-hidden="true"></i>
          </div>
          <div class="col-3 stock__price">
            <p class="data up-change">$455.55</p>
          </div>
          <div class="col-3 stock__price">
            <p class="data up-change">+10.54%</p>
          </div>
        </li>
      </ul>
    </div>
  `,
  styleUrls: ['./user-lists.component.scss']
})
export class UserListsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
