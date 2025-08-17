declare module 'mongoose' {
  export class Schema<T = any> {
    constructor(definition?: any, options?: any);
    index(...args: any[]): any;
    static Types: any;
  }
  export interface Model<T = any> {
    new (...args: any[]): any;
    [key: string]: any;
  }
  export function model<T = any>(name: string, schema?: Schema<T>): Model<T>;
  export const models: Record<string, any>;
  const mongoose: any;
  export default mongoose;
}
