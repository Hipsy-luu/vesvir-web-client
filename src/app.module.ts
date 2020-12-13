import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { LiveDataModule } from './modules/live-data/live-data.module';
import { UploadsModule } from './modules/uploads/uploads.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { CustomersModule } from './modules/customers/customers.module';
import { MailCenterModule } from './modules/mail-center/mail-center.module';
import { ProvidersModule } from './modules/providers/providers.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { BrandsModule } from './modules/brands/brands.module';
import { ProductsModule } from './modules/products/products.module';
import { StickersModule } from './modules/stickers/stickers.module';
import { CardsModule } from './modules/cards/cards.module';

@Module({
  imports: [
    DatabaseModule,
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 465 /* 587 */,
        ignoreTLS: false, // true
        secure: true, // false
        auth: {
          user: "api.test.beneficiarios@gmail.com",
          pass: "9AYRfGMo7HX2eN1e",
        },
        tls: { 
          rejectUnauthorized: false 
        }
      },
      defaults: {
        from: '"Programa de Beneficiarios" <api.test.beneficiarios@gmail.com>',
      },
      preview: false,
      template: {
        dir: /* process.cwd() */ __dirname + '/templates/emails/',
        adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
        options: {
          strict: true,
        },
      },
    }),

    //Dev Modules
    UserModule,
    AuthModule,
    LiveDataModule,
    UploadsModule,
    CustomersModule,
    MailCenterModule,
    ProvidersModule,
    CategoriesModule,
    BrandsModule,
    ProductsModule,
    StickersModule,
    CardsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
