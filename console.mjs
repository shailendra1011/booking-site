// console.js
import mongoose from 'mongoose';
import repl from 'repl';
import dotenv from 'dotenv';
import { Article } from './app/Models/Article.mjs';
import { Author } from './app/Models/Author.mjs';
// Add more models as needed

dotenv.config(); // load .env

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/articles';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    
    const r = repl.start('mongo> ');
    
    // Expose models in the REPL context
    r.context.Article = Article;
    r.context.Author = Author;
    r.context.mongoose = mongoose;

    r.on('exit', async () => {
      console.log('👋 Exiting...');
      await mongoose.disconnect();
      process.exit();
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection failed:', err);
    process.exit(1);
  });
