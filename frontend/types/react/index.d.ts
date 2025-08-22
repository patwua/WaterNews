// Minimal React type definitions for project
declare namespace JSX {
  interface IntrinsicElements { [elemName: string]: any }
  interface IntrinsicAttributes { key?: any }
}

declare namespace React {
  type ReactNode = any;
  type FC<P = {}> = (props: P & { children?: ReactNode; key?: any }) => any;
  interface KeyboardEvent<T = Element> {
    key: string;
    metaKey?: boolean;
    ctrlKey?: boolean;
    target: EventTarget;
    currentTarget: T;
    preventDefault(): void;
    [key: string]: any;
  }
  type KeyboardEventHandler<T = Element> = (event: KeyboardEvent<T>) => void;
  interface FormEvent<T = Element> {
    currentTarget: T;
    preventDefault(): void;
    [key: string]: any;
  }
  interface SVGProps<T> {
    [key: string]: any;
  }
  function useState<S = any>(initial?: S): [S, (s: S | ((p: S) => S)) => void];
  function useEffect(effect: (...args: any[]) => any, deps?: any[]): void;
  function useMemo<T = any>(factory: () => T, deps?: any[]): T;
  function useRef<T = any>(initial?: T): { current: T };
  function useId(): string;
  function createContext<T = any>(defaultValue: T): any;
  function useContext<T = any>(ctx: any): T;
}
export = React;
export as namespace React;

