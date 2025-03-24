import connectDB from "~/server/utils/db";
import Post from "~/server/models/Post";

export default defineEventHandler(async (event) => {
  await connectDB();
  const postId = event.context.params.id;

  const deletedPost = await Post.findByIdAndDelete(postId);

  if (!deletedPost) return { error: "Post not found" };

  return { success: true, message: "Post deleted" };
});
