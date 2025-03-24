import connectDB from "~/server/utils/db";
import Post from "~/server/models/Post";

export default defineEventHandler(async () => {
  await connectDB();
  const posts = await Post.find().sort({ createdAt: -1 });
  return posts;
});
