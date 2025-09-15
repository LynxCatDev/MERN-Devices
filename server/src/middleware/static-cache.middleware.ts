import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class StaticCacheMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Check if this is a request for static images
    if (req.path.match(/\.(?:png|jpg|jpeg|webp|gif|svg|ico)$/i)) {
      // Set cache headers for images
      res.setHeader(
        'Cache-Control',
        'public, max-age=900, s-maxage=900, stale-while-revalidate=59, immutable'
      );
      res.setHeader('Expires', new Date(Date.now() + 900000).toUTCString()); // 15 minutes
    }
    next();
  }
}