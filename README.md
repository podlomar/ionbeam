# IonCore Monorepo

A pure React SSR framework with automatic asset hashing, CSS modules, and zero configuration.

## Project Structure

This is a monorepo containing:

- **`packages/ioncore`** - The core framework library (publishable to npm)
- **`examples/basic-app`** - Example application showing how to use IonCore

## Getting Started

### One-Time Setup

Run this once to set everything up:

```bash
pnpm setup
```

This will:
1. Install dependencies in both packages
2. Build the library
3. Link the library globally
4. Link the library into the example app

### Running the Example

```bash
pnpm dev:example
```

This will start the example application at http://localhost:3000

## Development Workflow

### Working on the Library

1. Navigate to the library package:

```bash
cd packages/ioncore
```

2. Make your changes to the source files in `src/`

3. Build the library:

```bash
pnpm build
```

The example app will automatically use the updated version since it's linked.

### Manual Linking (if needed)

If you need to re-link the packages:

```bash
# In packages/ioncore
pnpm link --global

# In examples/basic-app
pnpm link --global ioncore
```

## Publishing the Library

When ready to publish `ioncore` to npm:

```bash
cd packages/ioncore
npm publish
```

## Using IonCore in Your Own Projects

Once published, users can install it:

```bash
npm install ioncore react react-dom
```

And use it like this:

```tsx
import { createServer } from 'ioncore/server';
import { HomePage } from './pages/HomePage/index.js';

const server = createServer({
  routes: [{ path: '/', component: HomePage }],
});

server.listen();
```

See [packages/ioncore/README.md](packages/ioncore/README.md) for full documentation.

## CLI Commands

- `pnpm build` - Build all packages
- `pnpm dev:example` - Run the example app in development mode

## Architecture

### How It Works

1. **Build System** - IonCore uses Rollup to bundle your application with automatic code splitting and asset hashing
2. **Asset Manifest** - Generated during build, maps logical names to hashed filenames
3. **SSR Server** - Express-based server with React 19 SSR support
4. **CSS Modules** - PostCSS processes CSS with automatic scoping and hashing

### Key Features

- ✅ Content-based asset hashing (CSS and JS)
- ✅ CSS Modules with automatic class name hashing
- ✅ TypeScript support out of the box
- ✅ Hot reload in development
- ✅ Zero configuration required
- ✅ Similar DX to Next.js but simpler

## License

MIT

## Author

Martin Podloucký (podlouckymartin@gmail.com)
