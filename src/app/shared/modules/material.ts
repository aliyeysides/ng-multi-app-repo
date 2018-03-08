import {NgModule} from '@angular/core';
import {
  MatExpansionModule,
  MatIconModule,
  MatMenuModule,
  MatButtonModule,
  MatTabsModule,
  MatSnackBarModule,
  MatTooltipModule,
  MatInputModule,
  MatAutocompleteModule,
  MatFormFieldModule,
} from '@angular/material';

@NgModule({
  imports: [
    MatExpansionModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    MatTabsModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatInputModule,
    MatAutocompleteModule,
    MatFormFieldModule,
  ],
  exports: [
    MatExpansionModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    MatTabsModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatInputModule,
    MatAutocompleteModule,
    MatFormFieldModule,
  ]
})
export class MaterialModule {}
