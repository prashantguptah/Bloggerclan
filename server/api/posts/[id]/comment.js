import { defineEventHandler, readBody, createError } from 'h3';
import Post from '~/server/models/Post';
import connectDB from "~/server/utils/db";

export default defineEventHandler(async (event) => {
  try {
    await connectDB();
    const { postId, content, authorEmail } = await readBody(event);


    if (!postId || !content  || !authorEmail) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing required fields'
      });
    }


    const post = await Post.findById(postId);
    if (!post) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Post not found'
      });
    }

 
    post.comments.push({
      content,
      authorEmail,
      createdAt: new Date()
    });

 
    await post.save();

 
    return {
      success: true,
      post
    };
  } catch (error) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message
    });
  }
});