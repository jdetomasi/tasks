import { connect, Connection, Model, Schema } from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

export class MongoMemoryServerHelper {
  private mongod: MongoMemoryServer;
  private mongoConnection: Connection;

  private async setupMongoMemoryServer(): Promise<void> {
    // Setup and connect to mongodb in-memory server
    this.mongod = await MongoMemoryServer.create();
    this.mongoConnection = (await connect(this.mongod.getUri())).connection;
  }

  public static async start(): Promise<MongoMemoryServerHelper> {
    const server = new MongoMemoryServerHelper();
    await server.setupMongoMemoryServer();
    return server;
  }

  public async stop(): Promise<void> {
    await this.mongoConnection.dropDatabase();
    await this.mongoConnection.close();
    await this.mongod.stop();
  }

  public async dropAllData(): Promise<void> {
    const collections = this.mongoConnection.collections;
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
  }

  public getModelFromMongoMemoryServer<T>(
    name: string,
    schema: Schema,
  ): Model<T> {
    return this.mongoConnection.model(name, schema) as Model<T>;
  }
}
