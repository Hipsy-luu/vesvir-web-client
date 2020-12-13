import { categoriesProviders } from './../../models/repositoriesModels/categories.providers';
import { productImagesProviders } from './../../models/repositoriesModels/productImages.providers';
import { quantityProviders } from './../../models/repositoriesModels/quantitys.providers';
import { productProviders } from './../../models/repositoriesModels/products.providers';
import { MailCenterModule } from './../mail-center/mail-center.module';
import { PassportModule } from '@nestjs/passport';
import { DatabaseModule } from './../../database/database.module';
import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { userProviders } from '../../models/repositoriesModels/user.providers';
import { directionProviders } from '../../models/repositoriesModels/directions.providers';
import { productStickersProviders } from '../../models/repositoriesModels/productStickers.providers';

@Module({
  imports: [
    DatabaseModule,
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
    MailCenterModule
  ],
  exports: [ProductsService],
  controllers: [ProductsController],
  providers: [
    ProductsService, 
    ...userProviders,
    ...directionProviders,
    ...productProviders,
    ...quantityProviders,
    ...productImagesProviders,
    ...productStickersProviders,
    ...categoriesProviders
  ],
})
export class ProductsModule {}
