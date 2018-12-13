
import { Component, OnInit, ViewChild, ElementRef, OnDestroy, LOCALE_ID } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormControlName, AbstractControl } from '@angular/forms';
import { fbind } from 'q';
import {  SubmissionEntry, Language, Languages, TravelRestriction,
          Country, ContactMethod, ContactPoint, EntryStatusType,
          EntryStatus, EntryStatusTrail, ManagedUser, VotingTeam
        } from 'src/core.model';
import { AppInternalSettings } from 'src/app.settings';
import { Validators } from '@angular/forms';
import { S3 } from 'aws-sdk';
import { AbstractControlStatus } from '@angular/forms/src/directives/ng_control_status';
import { EventInteraction } from '../../services/event.interaction.service';
import { AWSEngine } from '../../services/aws.engine';
import { Subscription } from 'rxjs';

@Component({
  selector: 'dja-form',
  templateUrl: './dja-form.component.html',
  styleUrls: ['./dja-form.component.scss'],
  providers: [AppInternalSettings, FormBuilder, { provide: LOCALE_ID, useValue: 'fr' },]
})
export class DjaFormComponent implements OnInit {
  @ViewChild('video') video;
  private countries: Array<string>;
  private languages: Array<string>;
 

  private subscription: Subscription;
  private formGroup: FormGroup;
  private fNameCtrl: AbstractControl;
  private lNameCtrl: AbstractControl;
  private emailCtrl: AbstractControl;
  private phoneCtrl: AbstractControl;
  private languageCtrl: AbstractControl;
  private countryCtrl: AbstractControl;
  private otherCountryCtrl: AbstractControl;

  private otherPrimaryLanguage: Boolean;
  private otherSecondaryLanguage: Boolean;
  private controls: Array<string>;
  constructor(
    private APP_SETTINGS : AppInternalSettings ,
    private fb: FormBuilder,
    public interactionPipe: EventInteraction,
    private awsPipe: AWSEngine
    ) {
    const self = this;
    this.subscription = this.interactionPipe.subscribe(e => {
      if (e.key === 'submissionComplete') {
          if (e.message) {
            // tell the user that everything is peachy
          }
          else{
            // tell the user to try again, maybe?
          }
      }
    });
    this.formGroup = this.makeForm();
    this.countries = this.APP_SETTINGS.settings.COUNTRIES;
    this.languages = this.APP_SETTINGS.settings.LANGUAGES;
    this.fNameCtrl = this.formGroup.get('first_name');
    this.lNameCtrl = this.formGroup.get('last_name');
    this.emailCtrl = this.formGroup.get('contact_methods.phone');
    this.phoneCtrl = this.formGroup.get('contact_methods.email');
    this.languageCtrl = this.formGroup.get('language');
    this.countryCtrl = this.formGroup.get('country');
    this.otherCountryCtrl = this.formGroup.get('other_country');
    this.controls = Object.keys(this.formGroup.controls);


    this.formGroup.get('languages.primary').valueChanges.subscribe(val => {

      if (val == "Other") {
        this.otherPrimaryLanguage = true
        this.formGroup.get('languages.other').setValidators(Validators.required);
      } else {
        this.otherPrimaryLanguage = false
        this.formGroup.get('languages.other').clearValidators();
      }
    })

   

    this.formGroup.get('travel_restriction').valueChanges.subscribe(val => {
      if (val == 1) {
        this.formGroup.get('travel_restriction_reason').setValidators(Validators.required);
      } else {
        this.formGroup.get('travel_restriction_reason').clearValidators();
      }
    });
    this.formGroup.get('travel_restriction').valueChanges.subscribe(val => {
      console.log(val)
    })
  }

  ngOnInit() {

  }

  videoChanged($e) {

  }

  processForm(e) {
    
    //this.awsPipe.submitMediaEntry(
    //  this.APP_SETTINGS.settings.ANONYMOUS_POOL_ID,
    //  this.APP_SETTINGS.settings.REGION,
    //  this.APP_SETTINGS.settings.VIDEO_SUBMISSION_BUCKET,
    //  document.getElementById('video')['files'][0],
    //  {
    //        test: 'test12102'
    //  },
    //  'submission-entry'
    //);
    // 14da3a49-370d-737e-6ca5-2fc2d9c4eb53
    //this.awsPipe.getTableEntry(
    //  this.APP_SETTINGS.settings.ANONYMOUS_POOL_ID,
    //  this.APP_SETTINGS.settings.REGION,
    //  'f4d1048a-125b-0dda-0e63-55efa9c19cd7',
    //'submission-entry'
    //);
    //this.awsPipe.deleteTableItem(
    //  this.APP_SETTINGS.settings.ANONYMOUS_POOL_ID,
    //  this.APP_SETTINGS.settings.REGION,
    //  '14da3a49-370d-737e-6ca5-2fc2d9c4eb53',
    //'submission-entry'
    //);
    //this.awsPipe.getEntireTable(
    //  this.APP_SETTINGS.settings.ANONYMOUS_POOL_ID,
    //  this.APP_SETTINGS.settings.REGION,
    //  'submission-entry'
    //);
    let langValue = this.formGroup.get('languages').value;
    let languages : Languages = {
      primary: langValue.primary.value
    }

  if (langValue.secondary && !langValue.other){
    languages.secondary = langValue.secondary
  }
    
  if (  langValue.other ){
    if (  this.formGroup.get('languages.primary').value == 'Other'){
      languages.primary  =  langValue.other.value
    }else if ( langValue.other.value ){
      languages.secondary  =  langValue.other.value
    }
  }

  let contactKeys : Array<any> =  Object.keys( this.formGroup.get('contact_methods').value );
  let contacts : Array<any> = [
    {"type": ContactMethod.Email ,    'value': this.formGroup.get('contact_methods.email').value},
    {"type": ContactMethod.Phone ,    'value': this.formGroup.get('contact_methods.phone').value},
    {"type": ContactMethod.WhatsApp , 'value': this.formGroup.get('contact_methods.whats_app').value}
  ];
  
  console.log( contacts )



  const entry = {
    create_time: Date.now(),
    full_name: this.formGroup.get('first_name').value + " " + this.formGroup.get('last_name').value,
    first_name:  this.formGroup.get('first_name').value,
    last_name:  this.formGroup.get('last_name').value,
    country: this.formGroup.get('country').value != "Other" ? this.formGroup.get('country').value :  this.formGroup.get('other_country').value,
    gender:  this.formGroup.get('gender').value,
    spoken_languages:  languages,
    dob: new Date( ),
  
    valid_passport: this.formGroup.get('passport').value, // would rephrase the question: Do you own a valid passport issued by your country?
    travel_restriction: this.formGroup.get('travel_restriction'),
    
    
  }

  this.awsPipe.submitMediaEntry(
    this.APP_SETTINGS.settings.ANONYMOUS_POOL_ID,
    this.APP_SETTINGS.settings.REGION,
    this.APP_SETTINGS.settings.VIDEO_SUBMISSION_BUCKET,
    this.video.nativeElement.files[0],
    entry,
    this.APP_SETTINGS.settings.ENTRY_TABLE_NAME
  )



    //this.awsPipe.putTableEntry(
    //  this.APP_SETTINGS.settings.ANONYMOUS_POOL_ID,
    //  this.APP_SETTINGS.settings.REGION,
    //  null,
    //  entry,
    //  'submission-entry'
    //);
  
}

  makeForm( ) : FormGroup{

    return this.fb.group({
      first_name: [
        null,
        [Validators.required,
        Validators.minLength(2),
        Validators.maxLength(20)]
      ],
      last_name: [
        null,
        [Validators.required,
        Validators.minLength(2),
        Validators.maxLength(20)]
      ],
      dob: [null, Validators.required],
      gender: [null, Validators],
      country: [null, Validators.required],
      other_country: [null],
      contact_methods: this.fb.group({
        email: [null, Validators.compose([Validators.required, Validators.email])],
        phone: [null, Validators.compose([Validators.required])],
          //TODO - SET VALIDATOR FOR TELPHONE - Validators.pattern( ::: regex ::: )
        whats_app: [null, Validators.required],
        other: [null]
      }),
      languages: this.fb.group({
        primary: [null, Validators.required],
        secondary: [null],
        other: [null]
        },
        {
          validators: [Validators.required]
      }),
      travel_restriction: [false],
      travel_restriction_reason: [null],
      passport: [false],
      video: [null]
    })
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }
  }
}
