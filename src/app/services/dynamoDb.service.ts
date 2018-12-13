import { Injectable } from '@angular/core';
import * as AWS from 'aws-sdk';
import { Observable } from 'rxjs';
import { AWSService } from './aws.service';
import { EventInteraction } from './event.interaction.service';
import { UUID } from 'angular2-uuid';
import { query } from '@angular/core/src/render3';

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
    //if (!queryExpressions) {
    //  this.getEntireTable(pool, region, table_name);
    //  return;
    //}
    pool = 'us-east-1:277993d3-58e9-4b2d-9aa4-c3fe9de0343a';
    this.clearConfiguration();
    this.awsService.configure(region, pool);
    this.dynamodb = new AWS.DynamoDB();
    this.documentClient = new AWS.DynamoDB.DocumentClient();
    this.getFilteredTable(table_name, queryExpressions);
  }

  private getFilteredTable (table_name: string, queryExpressions: any) {
    const self = this;

    // AGE FILTER
    // const eqAgeFe = 'candidate_age = :age';
    // const eqAgeFeVal = { ':age': 34 };

    // AGE RANGE FILTER
    // const rangeAgeFe = 'candidate_age between :start_age and :end_age';
    // const rangeAgeFeVal = {
    //  ':start_age': 31,
    //  ':end_age': 66
    // };

    // TRAVEL RESTRITIONS FILTER
    // const eqTrFe = 'travel_restriction.travel_restriction = :val';
    // const eqTrFeVal = { ':val': true };

    // LANGUAGE FILTER - as 'primary' is as reserved word we have to use aliases here
    // const eqLangFe = '#sl.#prim.#lang = :lang or #sl.#sec.#lang = :lang';
    // const eqLangFeVal = { ':lang': 'French' };
    // const ean = {
    //   '#sl':  'spoken_languages', '#sec':  'secondary' , '#prim': 'primary', '#lang': 'language'
    // };

    // COUNTRY FILTER
    // const eqCntrFe = 'country.country = :val';
    // const eqCntrFeVal = { ':val': 'Zimbabwe' };

    // GENDER FILTER
    // const eqGenFe = 'gender = :gen';
    // const eqGenFeVal = { ':gen' : 'Male' };

    // VALID PASSPORT FILTER
    // const eqVpFe = 'valid_passport = :val';
    // const eqVpFeVal = { ':val': true };

    // ENTRY STATUS FILTER
    // const eqStsFe = '#st1.#st2 = :stat';
    // const eqStsFeVal =  { ':stat': 'New' };
    // const ean = {
    //  '#st1':  'status', '#st2':  'status'
    // };

    // ENTRY STATUS & LANGUAGE FILTER - this is the more complex query, or evaluated before and and reserved keywords inconvenience
    const eqLangStsFe = '(#sl.#prim.#lang = :lang or #sl.#sec.#lang = :lang) and  #st1.#st2 = :stat';
    const eqLangStsFeVal = { ':lang': 'French',  ':stat': 'New'};
    const ean = {
       '#sl':  'spoken_languages', '#sec':  'secondary' , '#prim': 'primary', '#lang': 'language', '#st1':  'status', '#st2':  'status'
    };

    const params = {
      TableName : table_name,
      FilterExpression : eqLangStsFe,
      ExpressionAttributeValues: eqLangStsFeVal,
      ExpressionAttributeNames: ean
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

  public getTableEntry (pool: string, region: string, key: string, table_name: string) {
    // pool = 'us-east-1:277993d3-58e9-4b2d-9aa4-c3fe9de0343a';
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
    // pool = 'us-east-1:277993d3-58e9-4b2d-9aa4-c3fe9de0343a';
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
}
