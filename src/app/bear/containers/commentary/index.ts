import { NgModule } from '@angular/core';
import {SharedModule} from '../../../shared/index';
import {routing} from './commentary.routing';
import {CommentaryComponent} from './commentary.component';
import {BsDropdownModule} from 'ngx-bootstrap';

@NgModule({
  imports: [
    routing,
    SharedModule,
    BsDropdownModule.forRoot()
  ],
  declarations: [CommentaryComponent]
})
export class CommentaryModule { }
