import connectDB from "~/server/utils/db";
import Post from "~/server/models/Post";

export default defineEventHandler(async (event) => {
  await connectDB();
  const userId = event.context.params.id;

  if (!userId) return { error: "User ID is required" };

  const posts = await Post.find({ authorId: userId }).sort({ createdAt: -1 });

  return posts;
});
