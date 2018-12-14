import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormControlName, AbstractControl } from '@angular/forms';
import { fbind } from 'q';
import {  SubmissionEntry, Language, Languages, TravelRestriction,
          Country, ContactMethod, ContactPoint, EntryStatusType,
          EntryStatus, EntryStatusTrail, ManagedUser, VotingTeam
        } from 'src/core.model';
import { AppInternalSettings } from 'src/app.settings';
import { Validators } from '@angular/forms';
import { S3 } from 'aws-sdk';
import { EventInteraction } from '../../services/event.interaction.service';
import { AWSEngine } from '../../services/aws.engine';
import { Subscription } from 'rxjs';

@Component({
  selector: 'dja-form',
  templateUrl: './dja-form.component.html',
  styleUrls: ['./dja-form.component.scss'],
  providers: [ FormBuilder  ]
})
export class DjaFormComponent implements OnInit, OnDestroy {
  private countries: Array<string>;
  private languages: Array<string>;

  private subscription: Subscription;

  private formGroup :     FormGroup;
  private fNameCtrl :     AbstractControl;
  private lNameCtrl :     AbstractControl;
  private emailCtrl :     AbstractControl;
  private phoneCtrl :     AbstractControl;
  private languageCtrl :  AbstractControl;
  private countryCtrl :   AbstractControl;


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
      this.formGroup      = this.makeForm();
      this.countries      = this.APP_SETTINGS.settings.COUNTRIES;
      this.languages      = this.APP_SETTINGS.settings.LANGUAGES;
      this.fNameCtrl      = this.formGroup.controls.firstName;
      this.lNameCtrl      = this.formGroup.controls.firstName;
      this.emailCtrl      = this.formGroup.controls.firstName;
      this.phoneCtrl      = this.formGroup.controls.firstName;
      this.languageCtrl   = this.formGroup.controls.firstName;
      this.countryCtrl    = this.formGroup.controls.firstName;
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
    const qDef = this.awsPipe.getQueryDef('age_range');
    qDef.feVals[':start_age'] = 10;
    qDef.feVals[':end_age'] = 79;
    this.awsPipe.getFilteredTableEntries(
      this.APP_SETTINGS.settings.ANONYMOUS_POOL_ID,
      this.APP_SETTINGS.settings.REGION,
      this.APP_SETTINGS.settings.ENTRY_TABLE_NAME,
      qDef
    );

    const  entry = {
      candidate_age: 34,
      spoken_languages: {
      primary: { language: 'English'},
      secondary: { language: 'French'}
      },
      country: { country: 'Zimbabwe'},
      submission_date: new Date().toISOString(),
      first_name: 'Mata3',
      last_name: 'Hari',
      full_name: 'Mata3 Hari',
      gender: 'Male',
      travel_restriction: {
        travel_restriction: false
      },
      valid_passport: true,
      id: null,
      dob: new Date('March 21, 2012').toISOString(),
      contact_points: [{
        type: ContactMethod.Email,
        value: 'mata3@mata.com'
      }],
      status: {
        status: EntryStatusType.New,
        last_status_date: new Date().toISOString()
      }
    } as SubmissionEntry;


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
      firstName: [
        '',
        [Validators.required,
        Validators.minLength(2),
        Validators.maxLength(20)]
      ],
      lastName:[
        '',
        [Validators.required,
        Validators.minLength(2),
        Validators.maxLength(20)]
      ],
      country: ['' , Validators.required],
      contact_methods: this.fb.group({
        email: ['', Validators.compose([
          Validators.required,
          Validators.email
        ])],
        phone: ['',Validators.compose([
          Validators.required
          //TODO - SET VALIDATOR FOR TELPHONE - Validators.pattern( ::: regex :::)
       ])],
        whats_app: ["", Validators.required],
        other: [""]
      }),
      languages: this.fb.group({
        english: ['',Validators.compose([])],
        french: [''],
        portuguese: [''],
        other: ['']
      },
      Validators.required),
      video: ["", Validators.required]
    })
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }
  }
}
