import mongoose from 'mongoose';

export class Database {
  private connectionString: string;

  constructor() {
    this.connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/express-crud-api';
  }

  public async initialize(): Promise<void> {
    try {
      await mongoose.connect(this.connectionString);
      console.log('✅ Connected to MongoDB successfully');
    } catch (error) {
      console.error('❌ MongoDB connection error:', error);
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    try {
      await mongoose.disconnect();
      console.log('🔌 Disconnected from MongoDB');
    } catch (error) {
      console.error('❌ Error disconnecting from MongoDB:', error);
      throw error;
    }
  }

  public isConnected(): boolean {
    return mongoose.connection.readyState === 1;
  }
}
