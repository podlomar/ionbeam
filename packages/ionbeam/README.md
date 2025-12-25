# IonBeam

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
npm install ionbeam react react-dom
# or
pnpm add ionbeam react react-dom
```

## Quick Start

1. Create your server (`src/server.tsx`):

```tsx
import { createServer, IonCoreRequest } from 'ioncore';
import { Request, Response } from 'express';
import { HomePage } from './pages/HomePage/index.js';

const app = createServer();

// Define routes with full Express flexibility
app.get('/', async (req: Request, res: Response) => {
  await req.ioncore?.render(<HomePage />);
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
```

2. Create a page using the built-in `Page` component (`src/pages/HomePage/index.tsx`):

```tsx
import { JSX } from "react";
import { Page } from "ioncore";

export const HomePage = (): JSX.Element => {
  return (
    <Page title="Home">
      <h1>Welcome to IonBeam!</h1>
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
