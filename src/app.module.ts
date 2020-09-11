import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { LiveDataModule } from './modules/live-data/live-data.module';

@Module({
  imports: [
    DatabaseModule,
    UserModule,
    AuthModule,
    LiveDataModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
