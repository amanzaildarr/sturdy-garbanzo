import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { Database } from './database/database';
import { UserController } from './controllers/UserController';
import { errorHandler } from './middleware/errorHandler';

// Load environment variables
dotenv.config();

class App {
  public app: Application;
  private database: Database;
  private userController: UserController;

  constructor() {
    this.app = express();
    this.database = new Database();
    this.userController = new UserController(this.database);
    
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddlewares(): void {
    this.app.use(helmet());
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  private initializeRoutes(): void {
    // Health check endpoint
    this.app.get('/health', (req: Request, res: Response) => {
      res.status(200).json({ 
        status: 'OK', 
        message: 'Server is running',
        database: this.database.isConnected() ? 'Connected' : 'Disconnected',
        timestamp: new Date().toISOString()
      });
    });

    // API routes
    this.app.use('/api/users', this.userController.getRouter());

    // 404 handler
    this.app.use('*', (req: Request, res: Response) => {
      res.status(404).json({
        success: false,
        error: {
          message: `Route ${req.originalUrl} not found`
        }
      });
    });
  }

  private initializeErrorHandling(): void {
    this.app.use(errorHandler);
  }

  public async start(port: number): Promise<void> {
    try {
      await this.database.initialize();
      this.app.listen(port, () => {
        console.log('🚀 Server running on port', port);
        console.log('📊 Health check: http://localhost:' + port + '/health');
        console.log('📡 API endpoint: http://localhost:' + port + '/api/users');
      });
    } catch (error) {
      console.error('❌ Failed to start server:', error);
      process.exit(1);
    }
  }

  public async shutdown(): Promise<void> {
    try {
      await this.database.disconnect();
      console.log('👋 Server shutdown complete');
    } catch (error) {
      console.error('❌ Error during shutdown:', error);
    }
  }
}

export default App;
