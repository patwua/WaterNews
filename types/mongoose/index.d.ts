// Minimal mongoose declarations for local typechecking
declare module "mongoose" {
  export const Types: {
    ObjectId: any;
    Mixed: any;
    [key: string]: any;
  };

  export class Schema<T = any> {
    constructor(definition?: any, options?: any);
    index(fields: any, options?: any): void;
    static Types: typeof Types;
  }

  export interface Model<T = any> {
    new (doc?: any): T & { save: (...args: any[]) => Promise<T> };
    [key: string]: any;
  }

  export const model: <T = any>(name: string, schema?: Schema<any>) => Model<T>;
  export const models: Record<string, Model<any>>;

  export function connect(uri: string, options?: any): Promise<any>;
  export const connection: any;

  const mongoose: {
    model: typeof model;
    models: typeof models;
    Schema: typeof Schema;
    Types: typeof Types;
    connect: typeof connect;
    connection: any;
  };
  export default mongoose;
}
