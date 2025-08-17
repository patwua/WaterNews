declare module "react-dom" {
  export const version: string;
  export function render(...args: any[]): any;
  export function hydrate(...args: any[]): any;
  const ReactDOM: any;
  export default ReactDOM;
}
