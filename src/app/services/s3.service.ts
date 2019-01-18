import { Injectable } from '@angular/core';
import * as AWS from 'aws-sdk';
import { SELECT_MULTIPLE_VALUE_ACCESSOR } from '@angular/forms/src/directives/select_multiple_control_value_accessor';
import { AWSService } from './aws.service';
import { EventInteraction } from './event.interaction.service';

@Injectable({
  providedIn: 'root'
})
export class S3Service {
  public s3: AWS.S3;

  constructor(
    private awsService: AWSService,
    public interactionPipe: EventInteraction
  ) {}

  public putObject(key: string, pool: string, region: string, bucket: string, file: any, item: any, table_name: string ) {
    if (this.s3) {
      this.s3 = null;
    }
    this.awsService.configure(region, pool);
    this.s3 = new AWS.S3({
      apiVersion: '2006-03-01',
      params: { Bucket: bucket }
    });
      const params = {
        Bucket: bucket,
        Key: key,
        Body: file,
        //ACL: 'private', // NOT SURE IS NEEDED
        ContentType: file.type // NOT SURE IS NEEDED
      };

      this.put(pool, region, params, item, table_name);
  }

  public getSignedUrl(pool: string, region: string, key, bucket, item: any, table_name: string) {
    const self = this;
    this.s3.getSignedUrl('getObject',
      { Bucket: bucket, Key: key}, function( err, data ) {
      if (err) {
        //console.log('Error', err);
      } else {
        const interactionMessage = {
          uri: data,
          pool: pool,
          region: region,
          key: key,
          item: item,
          tableName: table_name
        };
        self.interactionPipe.next( { key: 'videoAccepted', message: interactionMessage } );
        //console.log('Success', data);
      }
    });
  }

  private put(pool: string, region: string, params, item: any, table_name: string) {
    const self = this;

    // THIS ERRORS !!!
    let request = this.s3.upload(params, function( err, data: AWS.S3.ManagedUpload.SendData ) {
      if (err) {
        //console.log('Error', err);
      } else {
        //console.log('Success', data);
        const interactionMessage = {
          uri: data.Location,
          pool: pool,
          region: region,
          key: params.Key,
          item: item,
          tableName: table_name
        };
        self.interactionPipe.next( { key: 'videoAccepted', message: interactionMessage } );
        // the WRONG old way commented out below
        // self.getSignedUrl(pool, region, params.Key, params.Bucket, item, table_name);
      }
    }).on('httpUploadProgress', function(evt) {
      let percentLoaded = evt.loaded / evt.total * 100;
      self.interactionPipe.next( { key: 'percent_uploaded', message: percentLoaded });
    });

    //send(function(err, data) {
    //  self.interactionPipe.next( { key: 'percent_loaded', message: percentLoaded });
    //});
  }
}
