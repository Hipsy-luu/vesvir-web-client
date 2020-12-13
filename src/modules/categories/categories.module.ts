import { categoriesProviders } from './../../models/repositoriesModels/categories.providers';
import { Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { DatabaseModule } from '../../database/database.module';
import { PassportModule } from '@nestjs/passport';
import { MailCenterModule } from '../mail-center/mail-center.module';
import { userProviders } from '../../models/repositoriesModels/user.providers';
import { directionProviders } from '../../models/repositoriesModels/directions.providers';
import { productProviders } from '../../models/repositoriesModels/products.providers';
import { brandProviders } from '../../models/repositoriesModels/brands.providers';

@Module({
  imports: [
    DatabaseModule,
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
    MailCenterModule
  ],
  exports: [CategoriesService],
  controllers: [CategoriesController],
  providers: [
    CategoriesService, 
    ...userProviders,
    ...directionProviders,
    ...categoriesProviders,
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
export class CategoriesModule {}
