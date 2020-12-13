import { Module } from '@nestjs/common';
import { ProvidersController } from './providers.controller';
import { ProvidersService } from './providers.service';
import { DatabaseModule } from '../../database/database.module';
import { PassportModule } from '@nestjs/passport';
import { MailCenterModule } from '../mail-center/mail-center.module';
import { userProviders } from '../../models/repositoriesModels/user.providers';
import { directionProviders } from '../../models/repositoriesModels/directions.providers';
import { productProviders } from '../../models/repositoriesModels/products.providers';
import { quantityProviders } from '../../models/repositoriesModels/quantitys.providers';
import { productImagesProviders } from '../../models/repositoriesModels/productImages.providers';
import { productStickersProviders } from '../../models/repositoriesModels/productStickers.providers';
import { categoriesProviders } from '../../models/repositoriesModels/categories.providers';

@Module({
  imports: [
    DatabaseModule,
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
    MailCenterModule
  ],
  exports: [ProvidersService],
  controllers: [ProvidersController],
  providers: [
    ProvidersService, 
    ...userProviders,
    ...directionProviders,
    ...productProviders,
    ...quantityProviders,
    ...productImagesProviders,
    ...productStickersProviders,
    ...categoriesProviders
  ],
})
export class ProvidersModule {}
