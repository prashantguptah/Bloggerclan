import Post from "@/server/models/Post";
import { defineEventHandler, readBody } from "h3";

export default defineEventHandler(async (event) => {
  try {
    const { postId, userId, rating } = await readBody(event);

    if (!postId || !userId || !rating) {
      return { success: false, message: "Missing required fields" };
    }

    const post = await Post.findById(postId);
    if (!post) {
      return { success: false, message: "Post not found" };
    }

    const existingRating = post.ratings.find(r => r.userId.toString() === userId);
    if (existingRating) {
      existingRating.rating = rating; 
    } else {
      post.ratings.push({ userId, rating });
    }

    await post.save();

   
    const avgRating =
      post.ratings.reduce((acc, r) => acc + r.rating, 0) / post.ratings.length;

    return { success: true, avgRating, post };
  } catch (error) {
    return { success: false, message: error.message };
  }
});
