import * as React from 'react';
export const ShellContext = React.createContext<{ hasShell: boolean }>({ hasShell: false });
export function useShell(){ return React.useContext(ShellContext); }
