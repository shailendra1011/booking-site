import { parentPort } from 'worker_threads';
import mongoose from 'mongoose';
import { connectDB } from '../../config/db.mjs';
import { syncScheduledPost } from '../Helper/syncScheduledPost.mjs';
import logger from '../Helper/logger.mjs';

// Utility: Ensures MongoDB is connected
async function initMongoConnection(context = '') {
  if (mongoose.connection.readyState !== 1) {
    logger.warn(`MongoDB not connected (${context}). Attempting to connect...`);
    try {
      await connectDB();
      logger.info(`MongoDB connected in Worker thread (${context})`);
    } catch (err) {
      logger.error(`❌ MongoDB connection failed (${context}):`, err);
      throw err;
    }
  }
}

// Initial DB connect when worker starts
await initMongoConnection('startup');

// Cron job trigger listener
parentPort.on('message', async (msg) => {
  let success = false;
  const jobresponse = {};

  try {
    // Check DB again before job runs
    await initMongoConnection('cron job');

    if (msg.job === 'syncScheduledPost') {
      const count = await syncScheduledPost();
      jobresponse.updatedCount = count;
    }

    success = true;
  } catch (error) {
    jobresponse.error = {
      message: error.message,
      stack: error.stack,
    };
  }

  parentPort.postMessage({
    success,
    jobresponse,
    timestamp: new Date().toISOString()
  });
});
