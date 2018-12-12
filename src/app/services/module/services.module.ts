import { NgModule } from '@angular/core';
import { DynamoService } from '../dynamoDb.service';
import { S3Service } from '../s3.service';
import { AWSService } from '../aws.service';
import { AWSEngine } from '../aws.engine';
import { AppInternalSettings } from '../../../app.settings';
import { EventInteraction } from '../event.interaction.service';

@NgModule({
  imports:      [ ],
  declarations: [ ],
  providers: [
    AppInternalSettings,
    EventInteraction,
    AWSService,
    DynamoService,
    S3Service,
    AWSEngine
  ],
  exports:      [ ],
})

export class AWSServicesModule {
}
