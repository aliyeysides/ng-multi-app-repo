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
  MatProgressSpinnerModule
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
    MatProgressSpinnerModule
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
    MatProgressSpinnerModule
  ]
})
export class MaterialModule {}
