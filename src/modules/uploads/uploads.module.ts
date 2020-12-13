import { productStickersProviders } from './../../models/repositoriesModels/productStickers.providers';
import { productImagesProviders } from './../../models/repositoriesModels/productImages.providers';
import { brandProviders } from './../../models/repositoriesModels/brands.providers';
import { categoriesProviders } from './../../models/repositoriesModels/categories.providers';
import { directionProviders } from './../../models/repositoriesModels/directions.providers';
import { Module } from '@nestjs/common';
//Se importa el modulo de la base de datos para hacer disponible la instancia en el servicio
import { DatabaseModule } from '../../database/database.module';
//import into any module that contains routes we want to protect with our JWT authorisation. 
import { PassportModule } from '@nestjs/passport';

import { UploadsService } from './uploads.service';
import { UploadsController } from './uploads.controller';

//Con esto se importa de algun modo la tabla de usuarios para poderla inyectar en el servicio
import { userProviders } from '../../models/repositoriesModels/user.providers';

@Module({
  imports: [
    DatabaseModule,
    PassportModule.register({ defaultStrategy: 'jwt', session: false })
  ],
  exports: [UploadsService],
  controllers: [UploadsController],
  providers: [
    UploadsService,
    ...userProviders,
    ...directionProviders,
    ...categoriesProviders,
    ...brandProviders,
    ...productImagesProviders,
    ...productStickersProviders
  ],
})
export class UploadsModule {}
