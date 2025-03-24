import connectDB from "~/server/utils/db";
import Post from "~/server/models/Post";

export default defineEventHandler(async (event) => {
  await connectDB();
  const postId = event.context.params.id;
  const body = await readBody(event);

  const updatedPost = await Post.findByIdAndUpdate(postId, body, { new: true });

  if (!updatedPost) return { error: "Post not found" };

  return { success: true, post: updatedPost };
});

