declare module 'mongodb' {
  export class ObjectId {
    constructor(id?: string);
  }
  export interface Db {
    collection(name: string): any;
  }
  export class MongoClient {
    static connect(uri: string): Promise<MongoClient>;
    db(name?: string): Db;
  }
}

