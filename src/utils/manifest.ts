import { readFileSync } from 'node:fs';
import { join } from 'node:path';

let manifestCache: Record<string, string> | null = null;

export const getManifest = (): Record<string, string> => {
  if (manifestCache !== null) {
    return manifestCache;
  }

  try {
    const manifestPath = join(process.cwd(), 'static', 'manifest.json');
    const manifestContent = readFileSync(manifestPath, 'utf-8');
    const manifest = JSON.parse(manifestContent);
    manifestCache = manifest;
    return manifest;
  } catch (error) {
    console.warn('Could not read manifest.json, client scripts may not be available');
    return {};
  }
};

export const getAsset = (assetName: string): string | undefined => {
  const manifest = getManifest();
  return manifest[assetName];
};
