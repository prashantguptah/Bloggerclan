import { defineEventHandler, readBody, createError } from 'h3';
import Post from '~/server/models/Post';
import connectDB from "~/server/utils/db";

export default defineEventHandler(async (event) => {
  try {
     await connectDB();
    const { id } = event.context.params; 
    const { commentId, content, authorEmail } = await readBody(event);

    if (!commentId || !content || !authorEmail) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing required fields',
      });
    }

    const post = await Post.findById(id);
    if (!post) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Post not found',
      });
    }

    const comment = post.comments.id(commentId);
    if (!comment) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Comment not found',
      });
    }


    const reply = {
      content,
      authorEmail,
      createdAt: new Date(),
    };

    comment.replies.push(reply);
    await post.save();

    return {
      success: true,
      reply,
    };
  } catch (error) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message,
    });
  }
});
