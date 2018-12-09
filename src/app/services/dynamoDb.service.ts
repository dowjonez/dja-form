import { Injectable } from '@angular/core';
import * as AWS from 'aws-sdk';
import { Observable } from 'rxjs';
import { UUID } from 'angular2-uuid'; // use a third-party library or custom logic for generating the GUIDs of the newly created items

@Injectable({
  providedIn: 'root'
})
export class DynamoService {
  private dynamodb;
  private documentClient;
  private params = {
    TableName: 'submission-entry'
  };
  public tableName = 'submission-entry';
  public tableRegion = 'us-east-1';

  public IdentityPoolId = 'us-east-1:72e65e24-58b0-4d99-baa5-e35acdeb6d78';

  constructor() {
    const creds: AWS.CognitoIdentityCredentials =  new AWS.CognitoIdentityCredentials({
      IdentityPoolId: this.IdentityPoolId
    });

      // Initialize the Amazon Cognito credentials provider
      AWS.config.update({
        region: this.tableRegion,
        credentials: creds
      });

    this.dynamodb = new AWS.DynamoDB();
    this.documentClient = new AWS.DynamoDB.DocumentClient();
  }

  private newId() {
    return UUID.UUID();
  }

  public putItem (item: any, table_name: string) {
    item['id'] = UUID.UUID();

    const params = {
      TableName: table_name,
      Item: item
    };
    this.documentClient.put(params, function(err, data) {
      if (err) {
        console.log('Error', err);
      } else {
        console.log('Success', data);
      }
    });
  }
}
