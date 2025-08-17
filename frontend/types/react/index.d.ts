// Extremely minimal React types to allow TS to typecheck without @types/react
declare namespace JSX {
  interface IntrinsicElements { [elemName: string]: any }
}

declare module "react" {
  export type ReactNode = any;
  export namespace React {
    interface FormEvent<T = any> { [key: string]: any }
    interface SVGProps<T = any> { [key: string]: any }
    interface KeyboardEvent<T = any> { key: string; [key: string]: any }
  }
  export type FormEvent<T = any> = React.FormEvent<T>;
  export type SVGProps<T = any> = React.SVGProps<T>;
  export type KeyboardEvent<T = any> = React.KeyboardEvent<T>;
  export type FC<P = {}> = (props: P & { children?: ReactNode }) => any;
  export function useState<S = any>(initial?: S): [S, (s: S | ((p: S) => S)) => void];
  export function useEffect(effect: (...args: any[]) => any, deps?: any[]): void;
  export function useMemo<T = any>(factory: () => T, deps?: any[]): T;
  export function useRef<T = any>(initial?: T): { current: T };
  export function useId(): string;
  const React: any;
  export default React;
}
