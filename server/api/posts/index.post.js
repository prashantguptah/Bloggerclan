import connectDB from "~/server/utils/db";
import Post from "~/server/models/Post";

export default defineEventHandler(async (event) => {
  await connectDB();
  const body = await readBody(event);

  if (!body.title || !body.content || !body.authorId || !body.authorEmail) {
    return { error: "All fields are required." };
  }

  try {
    const newPost = new Post({
      title: body.title,
      content: body.content,
      image: body.image || "",
      authorId: body.authorId,
      authorEmail: body.authorEmail,
    });

    await newPost.save();
    return { success: true, post: newPost };
  } catch (error) {
    return { error: error.message };
  }
});
