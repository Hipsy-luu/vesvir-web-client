import { Module } from '@nestjs/common';
//Se importa el modulo de la base de datos para hacer disponible la instancia en el servicio
import { DatabaseModule } from '../../database/database.module';
//import into any module that contains routes we want to protect with our JWT authorisation. 
import { PassportModule } from '@nestjs/passport';

//Se le asigna el servicio al modulo
import { UserService } from './user.service';
//Se le asigna el controlador encargado de las rutas al modulo
import { UserController } from './user.controller';
//Con esto se importa de algun modo la tabla de usuarios para poderla inyectar en el servicio
import { userProviders } from '../../models/repositoriesModels/user.providers';

@Module({
  imports: [
    DatabaseModule,
    PassportModule.register({ defaultStrategy: 'jwt', session: false })
  ],
  exports: [UserService],
  controllers: [UserController],
  providers: [
    UserService, 
    ...userProviders,
  ],
})

export class UserModule {}