import connectDB from "~/server/utils/db";
import Post from "~/server/models/Post";
import { getUserSession } from "~/server/utils/auth"; 

export default defineEventHandler(async (event) => {
  await connectDB();
  const user = getUserSession(event); 

  if (!user) {
    return { error: "Unauthorized" };
  }

  
  const bookmarkedPosts = await Post.find({ bookmarks: user._id }).sort({ createdAt: -1 });

  return bookmarkedPosts;
});
