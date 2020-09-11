import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { userProviders } from '../../models/repositoriesModels/user.providers';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
    JwtModule.register({
      secretOrPrivateKey: 'UxKeyMyBand',
      signOptions: {
        expiresIn: 60 * 60 * 24 * 365, // segundos * minutos * horas * dias
      },
    }),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthService,JwtStrategy, ...userProviders],
})
export class AuthModule {}
