// app/Helper/syncScheduledPost.mjs
import { Article } from "../Models/Article.mjs";
import logger from "./logger.mjs";

export async function syncScheduledPost() {
  try {
    
    const now = new Date();

    const articlesToPublish = await Article.find({
      publish: 'scheduled',
      publishTime: { $lte: now }
    }, { _id: 1, title: 1, slug: 1, publishTime: 1 });

    if (articlesToPublish.length === 0) {
      return 0;
    }

    logger.info(`Publishing ${articlesToPublish.length} scheduled post(s):`);
    articlesToPublish.forEach(article => {
      logger.info(`Publishing article: ID=${article._id}, Title="${article.title}", Slug="${article.slug}"`);
    });

    const result = await Article.updateMany(
      { publish: 'scheduled', publishTime: { $lte: now } },
      { $set: { publish: 'published', publishedAt: now } }
    );

    return result.modifiedCount;
  } catch (error) {
    logger.error("Error in syncScheduledPost:", error);
    throw error;
  }
}
