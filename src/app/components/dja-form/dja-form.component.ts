import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormControlName, AbstractControl } from '@angular/forms';
import { fbind } from 'q';
import * as model from 'src/core.model';
import { AppInternalSettings } from 'src/app.settings';
import { Validators } from '@angular/forms';
import { S3 } from 'aws-sdk';
import { S3Service } from 'src/app/services/s3.service';
@Component({
  selector: 'dja-form',
  templateUrl: './dja-form.component.html',
  styleUrls: ['./dja-form.component.scss'],
  providers: [ AppInternalSettings, FormBuilder, S3Service  ]
})
export class DjaFormComponent implements OnInit {
  private countries: Array<string>;
  private languages: Array<string>;
  
  private formGroup :     FormGroup;
  private fNameCtrl :     AbstractControl;
  private lNameCtrl :     AbstractControl;
  private emailCtrl :     AbstractControl;
  private phoneCtrl :     AbstractControl;
  private languageCtrl :  AbstractControl;
  private countryCtrl :   AbstractControl;


  constructor( private APP_SETTINGS : AppInternalSettings , private fb : FormBuilder, private s3 : S3Service) { 
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
  
  videoChanged($e){

  }

  processForm(e){
   this.s3.postFile( document.getElementById("video")['files'][0]); 
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
}
