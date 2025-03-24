import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  image: { type: String }, // Optional Image URL
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  authorEmail: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
});

export default mongoose.model("Post", PostSchema);
