import { Module } from '@nestjs/common';
import { MailCenterController } from './mail-center.controller';
import { MailCenterService } from './mail-center.service';
import { userProviders } from '../../models/repositoriesModels/user.providers';
import { DatabaseModule } from '../../database/database.module';
import { PassportModule } from '@nestjs/passport';
import { directionProviders } from '../../models/repositoriesModels/directions.providers';

@Module({
  imports: [
    DatabaseModule,
    PassportModule.register({ defaultStrategy: 'jwt', session: false })
  ],
  exports: [MailCenterService],
  controllers: [MailCenterController],
  providers: [
    MailCenterService, 
    ...userProviders,
    ...directionProviders
  ],
})
export class MailCenterModule {}
