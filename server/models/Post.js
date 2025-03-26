import mongoose from "mongoose";

const ReplySchema = new mongoose.Schema({
  content: { type: String, required: true },
  authorEmail: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const CommentSchema = new mongoose.Schema({
  content: { type: String, required: true },
  authorEmail: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  replies: [ReplySchema]
});


const RatingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  rating: { type: Number, required: true, min: 1, max: 5 }
});


const PostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  image: { type: String }, // Optional Image URL
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  authorEmail: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  comments: [CommentSchema],
  ratings: [RatingSchema] 
});

export default mongoose.model("Post", PostSchema);
