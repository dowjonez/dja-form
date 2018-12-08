import { BrowserModule } from '@angular/platform-browser';
import { NgModule, InjectionToken } from '@angular/core';
import * as model from 'src/core.model';
import { AppComponent } from './app.component';
import { AppInternalSettings } from 'src/app.settings';
import { FormGroup, FormControl, FormControlName, FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { DjaFormComponent } from './components/dja-form/dja-form.component';

@NgModule({
  declarations: [
    AppComponent,
    DjaFormComponent
    
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule
  ],
  providers: [ AppInternalSettings ],
  bootstrap: [AppComponent]
})
export class AppModule {
  
  constructor ( ){
    
  }
}

