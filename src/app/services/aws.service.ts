import { Injectable } from '@angular/core';
import * as AWS from 'aws-sdk';

@Injectable({
  providedIn: 'root'
})
export class AWSService {

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
}
