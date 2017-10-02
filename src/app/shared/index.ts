import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';

import {SHARED_COMPONENTS} from './components/index';

import {FullListModalComponent} from "app/shared/components/idea-lists";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
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

