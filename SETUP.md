# IonCore Development Setup

## Simple Structure (No Workspace)

This project uses a simple structure with manual linking instead of pnpm workspaces.

### Directory Structure

```
ioncore/
├── packages/
│   └── ioncore/           # The library package
│       ├── src/
│       ├── package.json
│       └── tsconfig.json
└── examples/
    └── basic-app/         # Example app
        ├── src/
        ├── package.json
        └── tsconfig.json
```

## Quick Setup

### Option 1: Automated Setup (Recommended)

```bash
pnpm setup
```

This runs all setup steps automatically.

### Option 2: Manual Setup

1. **Install dependencies in both packages:**

```bash
cd packages/ioncore
pnpm install

cd ../../examples/basic-app
pnpm install
```

2. **Build the library:**

```bash
cd packages/ioncore
pnpm build
```

3. **Link the library:**

```bash
# In packages/ioncore
pnpm link --global

# In examples/basic-app
cd ../../examples/basic-app
pnpm link --global ioncore
```

## How Linking Works

- `pnpm link --global` in the library creates a global symlink to the package
- `pnpm link --global ioncore` in the example app creates a symlink from `node_modules/ioncore` to the global package
- Changes to the built library are immediately available in the example app
- You must rebuild the library (`pnpm build`) for changes to take effect

## Development Workflow

1. Make changes to library source code
2. Build the library: `cd packages/ioncore && pnpm build`
3. Test in example app: `cd examples/basic-app && pnpm dev`

## Troubleshooting

### "Cannot find module 'ioncore'"

Re-link the packages:

```bash
cd packages/ioncore
pnpm link --global

cd ../../examples/basic-app
pnpm link --global ioncore
```

### Changes not showing up

Make sure you rebuilt the library:

```bash
cd packages/ioncore
pnpm build
```

### Start fresh

```bash
# Unlink
cd examples/basic-app
pnpm unlink ioncore

cd ../../packages/ioncore
pnpm unlink --global

# Re-run setup
cd ../..
pnpm setup
```
