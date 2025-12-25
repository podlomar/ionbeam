import { JSX } from 'react/jsx-runtime';
import express, { Express, Request, Response, NextFunction } from 'express';
import { prerenderToNodeStream } from 'react-dom/static';
import { getAsset } from '../utils/manifest.js';
import { AssetsProvider } from '../utils/assets-context.js';
import path from 'node:path';

// Extend Express Request to include ionbeam context
declare global {
  namespace Express {
    interface Request {
      ionbeam: IonCore;
    }
  }
}

export interface IonCore {
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

    console.log('IonCore Middleware: Attaching IonCore context to request');
    console.log(` - Client Script: ${clientScript}`);
    console.log(` - Style Sheet: ${styleSheet}`);

    req.ionbeam = {
      render: async (element: React.ReactNode) => {
        const { prelude } = await prerenderToNodeStream(
          <AssetsProvider value={{ clientScript, styleSheet }}>
            {element}
          </AssetsProvider>
        );
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
