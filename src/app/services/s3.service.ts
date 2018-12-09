import { Injectable } from '@angular/core';
//import { S3, CognitoIdentityCredentials } from 'aws-sdk';
import * as AWS from "aws-sdk";
import { SELECT_MULTIPLE_VALUE_ACCESSOR } from '@angular/forms/src/directives/select_multiple_control_value_accessor';
@Injectable({
  providedIn: 'root'
})



export class S3Service {
  public key : string;
  public aws_bucket = 'djafricashow-submissions';
  public bucketRegion = 'us-east-1';
  public IdentityPoolId = 'us-east-1:72e65e24-58b0-4d99-baa5-e35acdeb6d78';
  public s3 : AWS.S3;

  constructor() { 
    let creds : AWS.CognitoIdentityCredentials =  new AWS.CognitoIdentityCredentials({
      IdentityPoolId: this.IdentityPoolId
    });

    // Initialize the Amazon Cognito credentials provider
    AWS.config.update({
      region: this.bucketRegion,
      credentials: creds
    });

    AWS.config.getCredentials( err => {
      debugger  
    } )

   

    console.log(AWS.config.credentials);

    this.s3 = new AWS.S3({
      apiVersion: '2006-03-01',
      params: {Bucket:this.aws_bucket}
    });
  }


  public postFile( file ){
      let params = {
        Bucket: this.aws_bucket, 
        Key: file.name, 
        Body: file,
        ACL: 'private-read',
        ContentType: file.mimetype
      };
      
      
      this.s3.putObject(params, function( err, data ) {
          if( err )
             console.log(err);
          else
            debugger 
      });

  }
}
