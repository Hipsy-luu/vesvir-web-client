import { MailCenterModule } from './../mail-center/mail-center.module';
import { Module } from '@nestjs/common';
import { CustomersController } from './customers.controller';
import { CustomersService } from './customers.service';
import { DatabaseModule } from '../../database/database.module';
import { PassportModule } from '@nestjs/passport';
import { userProviders } from '../../models/repositoriesModels/user.providers';
import { directionProviders } from '../../models/repositoriesModels/directions.providers';

@Module({
  imports: [
    DatabaseModule,
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
    MailCenterModule
  ],
  exports: [CustomersService],
  controllers: [CustomersController],
  providers: [
    CustomersService, 
    ...userProviders,
    ...directionProviders
  ],
})
export class CustomersModule {}
