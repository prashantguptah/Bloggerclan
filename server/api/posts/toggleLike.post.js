import connectDB from "~/server/utils/db";
import Post from "~/server/models/Post";

export default defineEventHandler(async (event) => {
  await connectDB();

  try {
    const userId = event.context.auth?.user?._id;
    if (!userId) return { error: "Unauthorized", status: 401 };

    const { postId } = await readBody(event);
    if (!postId) return { error: "Post ID required", status: 400 };

    const post = await Post.findById(postId);
    if (!post) return { error: "Post not found", status: 404 };

    const isLiked = post.likes.includes(userId);
    if (isLiked) {
      post.likes = post.likes.filter((id) => id.toString() !== userId.toString());
    } else {
      post.likes.push(userId);
    }

    await post.save();
    return { success: true, isLiked: !isLiked, likeCount: post.likes.length };
  } catch (error) {
    console.error("API Error:", error);
    return { error: "Internal Server Error", status: 500 };
  }
});
