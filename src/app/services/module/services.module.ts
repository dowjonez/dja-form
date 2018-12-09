import { NgModule } from '@angular/core';
import { DynamoService } from '../dynamoDb.service';
import { S3Service } from '../s3.service';

@NgModule({
  imports:      [ ],
  declarations: [ ],
  providers: [ DynamoService, S3Service ],
  exports:      [ ],
})

export class AWSServicesModule {
}
