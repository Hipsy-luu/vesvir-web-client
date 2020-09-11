import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //Se habilitan las cors para permitir solicitudes en Ionic y otras plataformas
  app.enableCors();
  await app.listen(3000);
}
bootstrap();
