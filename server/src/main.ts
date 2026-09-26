import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import compression from 'compression';
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
  // Vercel's function bundle doesn't include swagger-ui-dist's static files,
  // so load the UI assets from a CDN instead of node_modules
  const swaggerUiCdn = 'https://cdn.jsdelivr.net/npm/swagger-ui-dist@5';
  SwaggerModule.setup('/api/docs/swagger', app, document, {
    customCssUrl: `${swaggerUiCdn}/swagger-ui.css`,
    customJs: [
      `${swaggerUiCdn}/swagger-ui-bundle.js`,
      `${swaggerUiCdn}/swagger-ui-standalone-preset.js`,
    ],
  });

  await app.listen(PORT);
  logger.log(`Server started on port ${PORT}`);
}
bootstrap();
