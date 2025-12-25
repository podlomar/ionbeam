import { createContext, useContext } from "react";

export interface AssetsContextValue {
  styleSheet: string | null;
  clientScript: string | null;
}

export const AssetsContext = createContext<AssetsContextValue>({
  styleSheet: null,
  clientScript: null,
});

export const AssetsProvider = AssetsContext.Provider;

export const useAssets = (): AssetsContextValue => useContext(AssetsContext);
