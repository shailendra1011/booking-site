import express from 'express';
import path from 'path';
import fs from 'fs';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';
import fileupload from 'express-fileupload';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import logger from './app/Helper/logger.mjs';
import morgan from 'morgan';
import { adminRouter } from './routes/admin.mjs';
import { apiRouter } from './routes/api.mjs';
import { fileURLToPath } from 'url';
import { connectDB } from './config/db.mjs';
import { queryLogger } from './app/Helper/queryLogger.mjs';
import { accessLogger } from './app/Helper/logger.mjs'; // Import accessLogger
import { deleteCacheFiles } from "./app/Helper/util.mjs";
import cron from "node-cron";
import { Worker } from 'worker_threads';

dotenv.config();
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 3000;

// Create an Express application
const app = express();
app.locals.cache_driver = process.env.CACHE_DRIVER;


// Convert the module URL to a file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set up middleware
app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Set up CORS options
const corsOptions = {
  origin: [process.env.FRONTEND_URL, process.env.ADMIN_URL, 'http://localhost:3000', 'https://preprod-article-cms.iexp.in', 'https://preprod-article-api.iexp.in', 'https://preprod-site-cms.iexp.in', 'https://preprod-site-api.iexp.in', 'https://preprod-auto.iexp.in', 'https://preprod-telecom.iexp.in', /^https?:\/\/(?:.+\.)?financialexpress\.com$/], // Replace with your Next.js app's URL
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // Include cookies and headers with credentials
};
app.use(cors(corsOptions));

// Set up static file serving for the /public/admin directory
app.use('/files', express.static(path.join(__dirname, 'public', 'admin')));
app.use(express.static(path.join(__dirname, 'public')));

// Set up file upload middleware
app.use(fileupload());

if (process.env.APP_DEBUG === 'true') {
  // Set up Query logging middleware
  app.use(queryLogger);
}

// Set up Swagger documentation
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Find-and-Glow",
      version: "1.0.0",
    },
    servers: [{
      url: process.env.BASE_URL,
    }],
  },
  apis: ["./routes/*.js"],
};
const swaggerSpec = swaggerJSDoc(options);
const swaggerConfig = JSON.parse(await fs.promises.readFile(new URL('./swagger.json', import.meta.url)));
const swaggerDocument = JSON.parse(await fs.promises.readFile(new URL('./swagger.json', import.meta.url)));
app.use(
  "/api-docs",
  function (req, res, next) {
    swaggerConfig.host = req.get("host");
    req.swaggerDoc = swaggerConfig;
    next();
  },
  swaggerUi.serveFiles(swaggerConfig, options),
  swaggerUi.setup(swaggerDocument)
);
//set interval for delete cache files
setInterval(deleteCacheFiles, 10 * 60 * 1000);

// Connect to MongoDB
mongoose.set('strictQuery', false);

if (process.env.APP_DEBUG === 'true') {
  // Use Morgan to log all requests to the Winston logger
  app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] :response-time ms ":referrer" ":user-agent"', {
    stream: {
      write: (message) => accessLogger.info(message.trim()) // Log to accessLogger
    }
  }));
}

// Set up routes
app.use('/admin', adminRouter);
app.use('/api', apiRouter);

// Handle uncaught exceptions
let server = null; // define server in outer scope

// Function to start the server
function startServer() {
  server = app.listen(PORT, HOST, () => {
    connectDB();
    console.log(`Server running on http://${HOST}:${PORT}`);
    startWorker();
  });
}

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error(`Uncaught Exception: ${err.message}`);
  setTimeout(() => {
    if (server) {
      server.close(() => {
        logger.error('Server closed due to uncaught exception. Restarting...');
        startServer();
      });
    } else {
      logger.error('No server instance found. Restarting directly...');
      startServer();
    }
  }, 1000);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error(`Unhandled Rejection at: ${promise}, reason: ${JSON.stringify(reason)}`);
  setTimeout(() => {
    if (server) {
      server.close(() => {
        logger.error('Server closed due to unhandled rejection. Restarting...');
        startServer();
      });
    } else {
      logger.error('No server instance found. Restarting directly...');
      startServer();
    }
  }, 1000);
});

// Start the server initially
startServer();


// --- Worker Thread initialization ---
const workerPath = path.join(__dirname, 'app', 'Workers', 'CronWorker.mjs');
let syncWorker;

function startWorker() {
  logger.info('Starting new worker...');

  syncWorker = new Worker(workerPath);
  syncWorker.on('message', (message) => {
    if (message.success) {
      logger.info(`Cron job completed. jobresponse: ${JSON.stringify(message.jobresponse)}`);
    } else if (message.error) {
      logger.error(`Cron job error. jobresponse: ${JSON.stringify(message.jobresponse)}`);
    }
  });

  syncWorker.on('error', (error) => {
    logger.error('Worker thread error:', error);
  });

  syncWorker.on('exit', (code) => {
    logger.error(`Worker exited with code ${code}`);
    if (code !== 0) {
      logger.info('Restarting worker after unexpected exit...');
      startWorker();
    }
  });
}


cron.schedule("* * * * *", () => {
  if (syncWorker) {
    syncWorker.postMessage({ "job": "syncScheduledPost" });
  }
});
