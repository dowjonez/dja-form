import { BrowserModule } from '@angular/platform-browser';
import { NgModule, InjectionToken, Injector,ApplicationRef } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import * as model from 'src/core.model';
import { AppComponent } from './app.component';
import { AppInternalSettings } from 'src/app.settings';
import { FormGroup, FormControl, FormControlName, FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { DjaFormComponent } from './components/dja-form/dja-form.component';
import { AWSServicesModule } from '../app/services/module/services.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { EventInteraction } from './services/event.interaction.service';
import { NgElement, WithProperties } from '@angular/elements';
import { AWSEngine } from './services/aws.engine';
import { VideoplayerComponent } from './components/videoplayer/videoplayer.component';
import {VgCoreModule} from 'videogular2/core';
import {VgControlsModule} from 'videogular2/controls';
import {VgOverlayPlayModule} from 'videogular2/overlay-play';
import {VgBufferingModule} from 'videogular2/buffering';

@NgModule({
  declarations: [
    AppComponent,
    DjaFormComponent,
    VideoplayerComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
   
    AWSServicesModule,
    NgbModule,
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule
  ],
  providers: [ AppInternalSettings,AWSEngine, EventInteraction, Validators],
  bootstrap: [],
  entryComponents: [DjaFormComponent, VideoplayerComponent]
})

export class AppModule {
  
  constructor ( private injector : Injector ){
      this.injector = injector;
      const djaForm = createCustomElement(DjaFormComponent, {injector: this.injector});
      customElements.define('dja-form', djaForm);
       const videoplayer = createCustomElement(VideoplayerComponent, {injector: this.injector});
      customElements.define('video-player', videoplayer);
  }

  ngDoBootstrap(ApplicationRef){
   
  };
}

