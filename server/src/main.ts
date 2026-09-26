import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import { NextFunction, Request, Response } from 'express';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const PORT = process.env.PORT || 5000;
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.use(cookieParser());
  app.use(
    compression({
      // reasonable defaults; brotli handled by reverse proxies if present
      level: 6,
    }),
  );
  app.enableCors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    exposedHeaders: 'set-cookie',
  });

  const config = new DocumentBuilder()
    .setTitle('TechnoHeart')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  const swaggerPath = '/api/docs/swagger';
  SwaggerModule.setup(swaggerPath, app, document);

  // Vercel's function bundle doesn't include swagger-ui-dist's static files,
  // so redirect any UI asset the static handler couldn't find to the CDN copy
  const swaggerUiCdn = 'https://cdn.jsdelivr.net/npm/swagger-ui-dist@5';
  const swaggerUiAssets = new Set([
    'swagger-ui.css',
    'swagger-ui-bundle.js',
    'swagger-ui-standalone-preset.js',
    'favicon-16x16.png',
    'favicon-32x32.png',
  ]);
  app.use(swaggerPath, (req: Request, res: Response, next: NextFunction) => {
    const file = req.path.split('/').pop();
    if (!swaggerUiAssets.has(file)) return next();
    res.redirect(`${swaggerUiCdn}/${file}`);
  });

  await app.listen(PORT);
  logger.log(`Server started on port ${PORT}`);
}
bootstrap();
