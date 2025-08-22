import { createContext, useContext } from 'react';
export const ShellContext = createContext<{ hasShell: boolean }>({ hasShell: false });
export function useShell(){ return useContext(ShellContext); }
