// Extremely minimal React types to allow TS to typecheck without @types/react
declare namespace JSX {
  interface IntrinsicElements { [elemName: string]: any }
  interface IntrinsicAttributes { key?: any }
}

declare module "react" {
  export type ReactNode = any;
  export type FC<P = {}> = (props: P & { children?: ReactNode }) => any;
  export interface SVGProps<T> { [key: string]: any }
  export interface KeyboardEvent<T = Element> { key: string; target: T; preventDefault(): void; [key: string]: any }
  export interface FormEvent<T = Element> { currentTarget: T; preventDefault(): void; [key: string]: any }

  export function useState<S = any>(initial?: S): [S, (s: S | ((p: S) => S)) => void];
  export function useEffect(effect: (...args: any[]) => any, deps?: any[]): void;
  export function useMemo<T = any>(factory: () => T, deps?: any[]): T;
  export function useRef<T = any>(initial?: T): { current: T };
  export function useId(): string;

  const React: any;
  export default React;
}
