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
npm install ionbeam
```

## Quick Start

1. Create your server (`src/server.tsx`) with a simple route:

```tsx
import { createServer } from 'ionbeam';
import type { Request, Response } from 'express';

const app = createServer();

app.get('/', async (req: Request, res: Response) => {
  await req.ionbeam.renderPage("Home",
    <>
      <h1>Home Page</h1>
      <p>Built with IonBeam - A flexible React SSR framework</p>
    </>
  );
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
```

2. Add scripts to your `package.json`:

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
