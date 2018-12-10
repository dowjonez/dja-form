import { Injectable } from '@angular/core';
import * as AWS from 'aws-sdk';
import { Observable } from 'rxjs';
import { AWSService } from './aws.service';
import { EventInteraction } from './event.interaction.service';

@Injectable({
  providedIn: 'root'
})
export class DynamoService {
  private dynamodb;
  private documentClient;
  private params = {
    TableName: 'submission-entry'
  };

  constructor(
    private awsService: AWSService,
    public interactionPipe: EventInteraction
  ) {
  }


  public putTableEntry (pool: string, region: string, key: string, item: any, table_name: string) {
    this.clearConfiguration();
    this.awsService.configure(region, pool);
    this.dynamodb = new AWS.DynamoDB();
    this.documentClient = new AWS.DynamoDB.DocumentClient();
    this.putItem (key, item, table_name);
  }

  private clearConfiguration() {
    if (this.dynamodb) {
      this.dynamodb = null;
      this.documentClient = null;
    }
  }

  // generic, should be used directly only in special cases
  private putItem (key: string, item: any, table_name: string) {
    item['id'] = key;

    const params = {
      TableName: table_name,
      Item: item
    };
    const self = this;
    this.documentClient.put(params, function(err, data) {
      if (err) {
        console.log('Error', err);
        self.interactionPipe.next( { key: 'submissionComplete', message: 'error' } );
      } else {
        console.log('Success', data);
        self.interactionPipe.next( { key: 'submissionComplete', message: 'success' } );
      }
    });
  }
}
