import { Module } from '@nestjs/common';
import { CardsController } from './cards.controller';
import { CardsService } from './cards.service';
import { DatabaseModule } from '../../database/database.module';
import { PassportModule } from '@nestjs/passport';
import { MailCenterModule } from '../mail-center/mail-center.module';
import { userProviders } from '../../models/repositoriesModels/user.providers';
import { directionProviders } from '../../models/repositoriesModels/directions.providers';
import { cardProviders } from '../../models/repositoriesModels/cards.providers';

@Module({
  imports: [
    DatabaseModule,
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
    MailCenterModule
  ],
  exports: [CardsService],
  controllers: [CardsController],
  providers: [
    CardsService, 
    ...userProviders,
    ...directionProviders,
    ...cardProviders
  ],
})
export class CardsModule {}
