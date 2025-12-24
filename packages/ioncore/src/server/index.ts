import { JSX } from 'react/jsx-runtime';
import express, { Express, Request, Response, NextFunction } from 'express';
import { prerenderToNodeStream } from 'react-dom/static';
import { getAsset } from '../utils/manifest.js';
import path from 'node:path';

// Extend Express Request to include ioncore context
declare global {
  namespace Express {
    interface Request {
      ioncore: IonCoreContext;
    }
  }
}

export interface IonCoreContext {
  clientScript?: string;
  styleSheet?: string;
  assets: {
    get: (name: string) => string | undefined;
  };
  render: (component: JSX.Element) => Promise<void>;
}

export interface ServerOptions {
  staticDir?: string;
}

/**
 * Middleware that adds IonCore context to request object
 * This allows route handlers to access assets and rendering utilities
 */
export function ionCoreMiddleware(options: ServerOptions = {}) {
  return (req: Request, res: Response, next: NextFunction) => {
    const clientScript = getAsset('client.js');
    const styleSheet = getAsset('server.css');

    req.ioncore = {
      clientScript,
      styleSheet,
      assets: {
        get: (name: string) => getAsset(name),
      },
      render: async (component: JSX.Element) => {
        const { prelude } = await prerenderToNodeStream(component);
        prelude.pipe(res);
      },
    };

    next();
  };
}

/**
 * Create an Express server with IonCore defaults
 * Returns a configured Express app that you can customize
 */
export function createServer(options: ServerOptions = {}): Express {
  const app = express();
  const staticDir = options.staticDir || path.join(process.cwd(), 'dist', 'static');

  // Default middleware
  app.use(express.static(staticDir));
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  // Add IonCore context to all requests
  app.use(ionCoreMiddleware(options));

  return app;
}
