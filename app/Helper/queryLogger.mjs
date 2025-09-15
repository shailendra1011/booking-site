import mongoose from 'mongoose';
import { queryLogger as logger } from './logger.mjs';

let isExecIntercepted = false;

// Middleware function to log MongoDB query execution time
export const queryLogger = (req, res, next) => {
  if (!isExecIntercepted) {
    interceptExec();
    isExecIntercepted = true;
  }

  // Initialize tracking data on request object
  req.queryCount = 0;
  req.queryInfo = [];

  req.incrementQueryCount = () => {
    req.queryCount++;
  };

  // Attach route and req to Mongoose queries
  const originalSetOptions = mongoose.Query.prototype.setOptions;
  mongoose.Query.prototype.setOptions = function (options) {
    this.options = { ...this.options, ...options, req, route: req.originalUrl };
    return this;
  };

  res.on('finish', () => {
    logQueries(req);
  });

  next();
};

function interceptExec() {
  const originalExec = mongoose.Query.prototype.exec;

  mongoose.Query.prototype.exec = function () {
    const startTime = Date.now();
    const query = this.getQuery();
    const collection = this.mongooseCollection.name;
    const operation = this.op;

    let result;

    try {
      result = originalExec.apply(this, arguments);

      if (result && typeof result.then === 'function') {
        result.then(() => {
          const duration = Date.now() - startTime;

          if (this.options.req && typeof this.options.req.incrementQueryCount === 'function') {
            this.options.req.incrementQueryCount();
          }

          const route = this.options.route || 'unknown route';

          this.options.req.queryInfo.push({
            collection,
            query,
            operation,
            route,
            duration,
          });
        }).catch((error) => {
          logger.error(`MongoDB Query Error - Collection: ${collection}, Query: ${JSON.stringify(query)}, Operation: ${operation}, Error: ${error}`);
        });
      }

      return result;

    } catch (err) {
      logger.error(`Error during query exec interception: ${err}`);
      return originalExec.apply(this, arguments); // Fallback
    }
  };
}

function logQueries(req) {
  if (!req.queryInfo.length) return;

  const totalDuration = req.queryInfo.reduce((sum, info) => sum + info.duration, 0);

  const queryLogs = req.queryInfo.map(info =>
    `MongoDB Query - Collection: ${info.collection}, Query: ${JSON.stringify(info.query)}, Operation: ${info.operation}, Route: ${info.route}, Duration: ${info.duration}ms`
  ).join('\n');

  logger.info(`Route: ${req.originalUrl}, Total Duration: ${totalDuration}ms, Query Count: ${req.queryCount}\n${queryLogs}`);
}

// Utility to get query count from a request object
export const getQueryCount = (req) => {
  return req.queryCount;
};
