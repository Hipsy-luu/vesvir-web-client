import { brandProviders } from './../../models/repositoriesModels/brands.providers';
import { categoriesProviders } from './../../models/repositoriesModels/categories.providers';
import { MailCenterModule } from './../mail-center/mail-center.module';
import { DatabaseModule } from './../../database/database.module';
import { Module } from '@nestjs/common';
import { BrandsController } from './brands.controller';
import { BrandsService } from './brands.service';
import { PassportModule } from '@nestjs/passport';
import { userProviders } from '../../models/repositoriesModels/user.providers';
import { directionProviders } from '../../models/repositoriesModels/directions.providers';
import { productProviders } from '../../models/repositoriesModels/products.providers';

@Module({
  imports: [
    DatabaseModule,
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
    MailCenterModule
  ],
  exports: [BrandsService],
  controllers: [BrandsController],
  providers: [
    BrandsService, 
    ...userProviders,
    ...directionProviders,
    ...productProviders,
    ...categoriesProviders,
    ...brandProviders,
    ...userProviders,
    ...directionProviders,
    ...categoriesProviders,
  ],
})
export class BrandsModule {}
