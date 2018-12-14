import { BrowserModule } from '@angular/platform-browser';
import { NgModule, InjectionToken, Injector } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import * as model from 'src/core.model';
import { AppComponent } from './app.component';
import { AppInternalSettings } from 'src/app.settings';
import { FormGroup, FormControl, FormControlName, FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { DjaFormComponent } from './components/dja-form/dja-form.component';
import { AWSServicesModule } from '../app/services/module/services.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { EventInteraction } from './services/event.interaction.service';
import { AWSEngine } from './services/aws.engine';

@NgModule({
  declarations: [
    AppComponent,
    DjaFormComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
   
    AWSServicesModule,
    NgbModule
  ],
  providers: [ AppInternalSettings,AWSEngine, EventInteraction, Validators],
  bootstrap: [],
  entryComponents: [DjaFormComponent]
})
export class AppModule {
  
  constructor ( private injector : Injector ){
      this.injector = injector;
  }

  ngDoBootstrap(){
    const djaForm = createCustomElement(DjaFormComponent, {injector: this.injector});
    customElements.define('dja-form', djaForm)
  };
}

