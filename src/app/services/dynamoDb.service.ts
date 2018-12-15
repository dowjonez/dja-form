import { Injectable } from '@angular/core';
import * as AWS from 'aws-sdk';
import { Observable } from 'rxjs';
import { AWSService } from './aws.service';
import { EventInteraction } from './event.interaction.service';
import { UUID } from 'angular2-uuid';
import { DdbQueryDef, DdbInternalSettings } from './ddb.settings';
import { EntryStatus, EntryStatusType } from '../../core.model';

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
    private ddbSettings: DdbInternalSettings,
    public interactionPipe: EventInteraction
  ) {
  }

  public getEntireTable (pool: string, region: string,  table_name: string) {
    pool = 'us-east-1:277993d3-58e9-4b2d-9aa4-c3fe9de0343a';
    this.clearConfiguration();
    this.awsService.configure(region, pool);
    this.dynamodb = new AWS.DynamoDB();
    this.documentClient = new AWS.DynamoDB.DocumentClient();
    this.getTable(table_name);
  }

  public getTable (table_name: string) {
    const self = this;
    const params = {
      TableName : table_name
    };
    this.documentClient.scan(params, function(err, data) {
      if (err) {
        console.error('Unable to read table.', JSON.stringify(err, null, 2));
        self.interactionPipe.next( { key: 'readTableComplete', message: 'error' } );
      } else {
        console.log('Success', data);
        self.interactionPipe.next( { key: 'readTableComplete', message: data } );
      }
    });
  }

  public getFilteredTableEntries (pool: string, region: string,  table_name: string, queryExpressions: any) {
    if (!queryExpressions) {
      this.getEntireTable(pool, region, table_name);
      return;
    }
    pool = 'us-east-1:277993d3-58e9-4b2d-9aa4-c3fe9de0343a';
    this.clearConfiguration();
    this.awsService.configure(region, pool);
    this.dynamodb = new AWS.DynamoDB();
    this.documentClient = new AWS.DynamoDB.DocumentClient();
    this.getFilteredTable(table_name, queryExpressions);
  }

  private getFilteredTable (table_name: string, queryExpressions: DdbQueryDef) {
    const self = this;
    let params: any;
     params = {
      TableName : table_name,
      FilterExpression : queryExpressions.fe,
      ExpressionAttributeValues: queryExpressions.feVals,
      Limit: this.ddbSettings.settings.DATASET_LIMIT
    };
    if (queryExpressions.feAliases) {
      params.ExpressionAttributeNames = queryExpressions.feAliases;
    }
    this.documentClient.scan(params, function(err, data) {
      if (err) {
        console.error('Unable to read table.', JSON.stringify(err, null, 2));
        self.interactionPipe.next( { key: 'readTableComplete', message: 'error' } );
      } else {
        console.log('Success', data);
        self.interactionPipe.next( { key: 'readTableComplete', message: data } );
      }
    });
  }

  public getTableEntry (pool: string, region: string, key: string, table_name: string) {
    pool = 'us-east-1:277993d3-58e9-4b2d-9aa4-c3fe9de0343a';
    this.clearConfiguration();
    this.awsService.configure(region, pool);
    this.dynamodb = new AWS.DynamoDB();
    this.documentClient = new AWS.DynamoDB.DocumentClient();
    this.getEntry(key, table_name);
  }

  private getEntry  (key: string, table_name: string) {
    const self = this;
    const params = {
      TableName: table_name,
      Key: {
        'id': key
      }
    };

    this.documentClient.get(params, function(err, data) {
      if (err) {
        console.error('Unable to read item.', JSON.stringify(err, null, 2));
        self.interactionPipe.next( { key: 'readComplete', message: 'error' } );
      } else {
        console.log('Success', data);
        self.interactionPipe.next( { key: 'readComplete', message: data } );
      }
    });
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
    item['id'] = item['id'] ? item['id'] : key;
    item['id'] = item['id'] ? item['id'] : UUID.UUID();
    // when replace create_date exists already
    item['submission_date'] = item['submission_date'] ? item['submission_date'] : this.today();
    if (!item['status']) {
      item['status'] = {
        status: EntryStatusType.New,
        last_status_date: item['submission_date']
      } as EntryStatus;
    }

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

  public deleteTableItem(pool: string, region: string, key: string, table_name: string) {
    pool = 'us-east-1:277993d3-58e9-4b2d-9aa4-c3fe9de0343a';
    this.clearConfiguration();
    this.awsService.configure(region, pool);
    this.dynamodb = new AWS.DynamoDB();
    this.documentClient = new AWS.DynamoDB.DocumentClient();
    this.deleteItem(key, table_name);
  }

  private deleteItem(key: string, table_name: string) {
    const self = this;
    const params = {
      TableName: table_name,
      Key: {
          'id': key
      }
    };

    this.documentClient.delete(params, function(err, data) {
      if (err) {
        console.log('Error', err);
        self.interactionPipe.next( { key: 'itemDeleted', message: 'error' } );
      } else {
        console.log('Success', data);
        self.interactionPipe.next( { key: 'itemDeleted', message: 'success' } );
      }
    });
  }

  public today() {
    return this.dateString(new Date());
  }

  public dateString(date: Date) {
    const dd = date.getDate();
    const mm = date.getMonth(); // January is 0!
    const yyyy = date.getFullYear();
    return new Date(yyyy, mm, dd, 0, 0, 0).toDateString();
  }
}
