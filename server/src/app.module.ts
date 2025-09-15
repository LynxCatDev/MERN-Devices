import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { CategoriesModule, DevicesModule, SlidersModule } from './api';
import { CollectionModule } from './api/collection/collection.module';
import { UsersModule } from './api/users/users.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/api/',
      serveStaticOptions: {
        maxAge: '15m',
        setHeaders: (res, path) => {
          if (/\.(?:png|jpg|jpeg|webp|gif|svg|ico)$/i.test(path)) {
            res.setHeader(
              'Cache-Control',
              'public, max-age=900, s-maxage=900, stale-while-revalidate=59, immutable',
            );
          }
        },
      },
    }),
    MongooseModule.forRoot(`${process.env.DATABASE_URL}`),
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
    HealthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
