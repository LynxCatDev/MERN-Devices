import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { join } from 'path';
import { CategoriesModule, DevicesModule, SlidersModule } from './api';
import { CollectionModule } from './api/collection/collection.module';
import { UsersModule } from './api/users/users.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/api/'
    }),
    MongooseModule.forRoot(
      'mongodb+srv://admin:14595@devices.oy68wq2.mongodb.net/technoheart?retryWrites=true&w=majority&appName=Devices'
    ),
    // JwtModule.register({
    //   global: true,
    //   secret: process.env.JWT_SECRET,
    //   signOptions: { expiresIn: '1h' }
    // }),
    UsersModule,
    CategoriesModule,
    SlidersModule,
    DevicesModule,
    CollectionModule,
    HealthModule
  ],
  controllers: [],
  providers: []
})
export class AppModule {}
