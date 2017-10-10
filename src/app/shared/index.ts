import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';

import {SHARED_COMPONENTS} from './components/index';

import {FullListModalComponent} from "app/shared/components/idea-lists";
import {BusyModule} from 'angular2-busy';
import {PipesModule} from './pipes/index';
import {IdeasService} from '../core/services/ideas.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    BusyModule,
    PipesModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    BusyModule,
    PipesModule,
    ...SHARED_COMPONENTS
  ],
  entryComponents: [
    FullListModalComponent
  ],
  declarations: [...SHARED_COMPONENTS],
  providers: []
})
export class SharedModule {
}

