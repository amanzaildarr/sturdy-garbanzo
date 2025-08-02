import App from './app';

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

const app = new App();

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('🛑 SIGTERM received. Shutting down gracefully...');
  await app.shutdown();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('🛑 SIGINT received. Shutting down gracefully...');
  await app.shutdown();
  process.exit(0);
});

app.start(PORT);
