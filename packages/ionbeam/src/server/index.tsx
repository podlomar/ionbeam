import { JSX } from 'react/jsx-runtime';
import express, { Express, Request, Response, NextFunction } from 'express';
import { prerenderToNodeStream } from 'react-dom/static';
import { getAsset } from '../utils/manifest.js';
import { AssetsProvider } from '../utils/assets-context.js';
import path from 'node:path';
import { Page } from '../components/Page/index.js';

declare global {
  namespace Express {
    interface Request {
      ionbeam: IonBeam;
    }
  }
}

export interface IonBeam {
  renderElement: (element: React.ReactNode) => Promise<void>;
  renderPage: (title: string, content: React.ReactNode) => Promise<void>;
}

export interface ServerOptions {
  staticDir?: string;
}

export const ionBeamMiddleware = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    const clientScript = getAsset('client.js');
    const styleSheet = getAsset('server.css');

    req.ionbeam = {
      renderPage: async (title: string, element: React.ReactNode) => {
        const { prelude } = await prerenderToNodeStream(
          <AssetsProvider value={{ clientScript, styleSheet }}>
            <Page title={title}>{element}</Page>
          </AssetsProvider>
        );
        prelude.pipe(res);
      },
      renderElement: async (element: React.ReactNode) => {
        const { prelude } = await prerenderToNodeStream(element);
        prelude.pipe(res);
      }
    };

    next();
  };
}

export const createServer = (options: ServerOptions = {}): Express => {
  const app = express();
  const staticDir = options.staticDir || path.join(process.cwd(), 'dist', 'static');

  app.use(express.static(staticDir));
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  app.use(ionBeamMiddleware());

  return app;
}
