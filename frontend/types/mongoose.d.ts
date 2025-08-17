declare module 'mongoose' {
  class Schema<T = any> {
    constructor(definition?: any, options?: any);
    index(...args: any[]): any;
    static Types: any;
  }
  interface Model<T = any> {
    new (...args: any[]): any;
    [key: string]: any;
  }
  function model<T = any>(name: string, schema?: Schema<T>): Model<T>;
  const models: Record<string, any>;
  namespace Types {
    const ObjectId: any;
  }
  const mongoose: any;
  export { Schema, model, models, Model, Types };
  export default mongoose;
}
