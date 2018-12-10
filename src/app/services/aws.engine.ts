import { Injectable } from '@angular/core';
import * as AWS from 'aws-sdk';
import { S3Service } from './s3.service';
import { DynamoService } from './dynamoDb.service';
import { EventInteraction } from './event.interaction.service';
import { UUID } from 'angular2-uuid';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AWSEngine {
  private subscription: any;

  constructor(
    private s3: S3Service,
    private db: DynamoService,
    public interactionPipe: EventInteraction
  ) {
    const self = this;
    this.subscription = this.interactionPipe.subscribe(e => {
      if (e.key === 'videoAccepted') {
          console.log(e.message);
          const ddbKey = UUID.UUID();
          e.message.item['video_uri'] = e.message.uri;
          e.message.item['video_s3_key'] = e.message.key;
          self.db.putTableEntry(e.message.pool, e.message.region, ddbKey, e.message.item, e.message.tableName);
      }
    });
  }


  public newId() {
    return UUID.UUID();
  }

  public submitMediaEntry(
    pool: string, region: string, bucket: string, file: any, item: any, table_name: string
  ) {
    const S3BucketKey = UUID.UUID();
    this.s3.putObject(S3BucketKey, pool, region, bucket, file, item, table_name);
  }

}
