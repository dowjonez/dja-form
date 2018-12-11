import { Injectable } from '@angular/core';
import * as AWS from 'aws-sdk';
import { EventInteraction } from './event.interaction.service';

@Injectable({
  providedIn: 'root'
})
export class AWSService {

  constructor(
    public interactionPipe: EventInteraction
  ) {

  }

  public configure(region, poolId) {
    const creds: AWS.CognitoIdentityCredentials =  new AWS.CognitoIdentityCredentials({
      IdentityPoolId: poolId
    });

    // Initialize the Amazon Cognito credentials provider
    AWS.config.update({
      region: region,
      credentials: creds
    });
  }

  public getCredentials() {
    const credentials = AWS.config.credentials as AWS.CognitoIdentityCredentials;
    const self = this;
    credentials.get(function(err) {
      if (err) {
          console.log('Error'  + err);
          return;
      }
      console.log('Cognito Identity Id: ' + credentials.identityId);
      self.interactionPipe.next( { key: 'Credentials', message: credentials.identityId } );
    });
  }
}
