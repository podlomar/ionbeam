# IonCore

A pure React SSR framework with automatic asset hashing, CSS modules, and zero configuration.

## Features

- 🚀 **Server-Side Rendering** - Built-in SSR with React 19
- 🎨 **CSS Modules** - Scoped styles with automatic class name hashing
- 📦 **Asset Hashing** - Automatic content-based hashing for cache busting
- 🔧 **Zero Config** - Works out of the box with sensible defaults
- ⚡ **Fast Development** - Hot reload with file watching
- 📝 **TypeScript First** - Full TypeScript support

## Installation

```bash
npm install ioncore react react-dom
# or
pnpm add ioncore react react-dom
```

## Quick Start

1. Create your server (`src/server.tsx`):

```tsx
import { createServer, IonCoreRequest } from 'ioncore';
import { Response } from 'express';
import { HomePage } from './pages/HomePage/index.js';

const app = createServer();

// Define routes with full Express flexibility
app.get('/', async (req: IonCoreRequest, res: Response) => {
  await req.ioncore?.render(<HomePage request={req} />);
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
```

2. Create a page using the built-in `Page` component (`src/pages/HomePage/index.tsx`):

```tsx
import { JSX } from "react";
import { Page, IonCoreRequest } from "ioncore";

interface Props {
  request: IonCoreRequest;
}

export const HomePage = ({ request }: Props): JSX.Element => {
  return (
    <Page title="Home" request={request}>
      <h1>Welcome to IonCore!</h1>
      <p>A flexible React SSR framework</p>
    </Page>
  );
};
```

3. Add scripts to your `package.json`:

```json
{
  "scripts": {
    "dev": "ioncore dev",
    "build": "ioncore build",
    "start": "ioncore start"
  }
}
```

4. Run your app:

```bash
npm run dev
```

## CLI Commands

- `ioncore dev` - Start development server with watch mode
- `ioncore build` - Build for production
- `ioncore start` - Start production server

## API

### `createServer(options?)`

Returns a configured Express app with IonCore middleware.

**Options:**
- `staticDir?: string` - Static files directory (default: 'dist/static')

**Returns:** Express `Application` instance

**Example:**

```tsx
import { createServer } from 'ioncore';

const app = createServer();

// Full Express API available
app.get('/', async (req, res) => {
  await req.ioncore?.render(<HomePage request={req} />);
});

app.post('/api/data', (req, res) => {
  res.json({ message: 'Hello!' });
});

app.listen(3000);
```

### `ionCoreMiddleware(options?)`

Middleware that adds IonCore context to request objects. Use this if you want to add IonCore to an existing Express app.

```tsx
import express from 'express';
import { ionCoreMiddleware } from 'ioncore';

const app = express();
app.use(ionCoreMiddleware());

app.get('/', async (req, res) => {
  // Access IonCore context
  const script = req.ioncore?.clientScript;
  await req.ioncore?.render(<App />);
});
```

### `<Page>` Component

Reusable page component that automatically injects hashed assets.

**Props:**
- `children: ReactNode` - Page content
- `title?: string` - Page title (default: "IonCore App")
- `description?: string` - Meta description
- `request: Request` - Express request object (provides IonCore context)

**Example:**

```tsx
import { Page } from 'ioncore';
import { Request } from 'express';

export const MyPage = ({ request }: { request: Request }) => {
  return (
    <Page title="My Page" description="Page description" request={request}>
      <h1>Hello World</h1>
    </Page>
  );
};
```

### `IonCoreContext`

The context object attached to `req.ioncore`:

```typescript
interface IonCoreContext {
  clientScript?: string;        // Hashed client JS filename
  styleSheet?: string;           // Hashed CSS filename
  assets: {
    get: (name: string) => string | undefined;
  };
  render: (component: JSX.Element) => Promise<void>;
}
```

### `getAsset(name)`

Get hashed asset filename from manifest.

```tsx
import { getAsset } from 'ioncore';

const clientScript = getAsset('client.js');
// Returns: 'client-abc12345.js'
```

### `IonCoreRequest`

TypeScript type for Express requests with IonCore context. Use this in your route handlers and page components for proper type safety.

```tsx
import { IonCoreRequest } from 'ioncore';
import { Response } from 'express';

app.get('/', async (req: IonCoreRequest, res: Response) => {
  // TypeScript knows about req.ioncore
  const script = req.ioncore?.clientScript;
  await req.ioncore?.render(<HomePage request={req} />);
});
```

## Advanced Usage

### Custom Layout Components

You can create your own layout components instead of using the built-in `Page`:

```tsx
import { Request } from 'express';

export const CustomLayout = ({ request, children }) => {
  const { clientScript, styleSheet } = request.ioncore || {};

  return (
    <html>
      <head>
        <title>My App</title>
        {styleSheet && <link rel="stylesheet" href={`/${styleSheet}`} />}
      </head>
      <body>
        <nav>My Navigation</nav>
        {children}
        {clientScript && <script src={`/${clientScript}`} defer />}
      </body>
    </html>
  );
};
```

### Adding Custom Middleware

```tsx
import { createServer } from 'ioncore';

const app = createServer();

// Add logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Add authentication
app.use('/admin', authMiddleware);

app.get('/admin', async (req, res) => {
  await req.ioncore?.render(<AdminPage request={req} />);
});
```

## License

MIT
