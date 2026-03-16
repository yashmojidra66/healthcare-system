import mongoose, { Document, Schema } from 'mongoose';

export interface IBlogPost extends Document {
  title: string;
  excerpt: string;
  content: string;
  author: mongoose.Types.ObjectId;
  authorName: string;
  authorAvatar?: string;
  category: string;
  tags: string[];
  imageUrl: string;
  publishedAt: Date;
  readTime: number;
  likes: number;
  comments: number;
}

const BlogPostSchema = new Schema<IBlogPost>(
  {
    title:        { type: String, required: true },
    excerpt:      { type: String, required: true },
    content:      { type: String, default: '' },
    author:       { type: Schema.Types.ObjectId, ref: 'User', required: true },
    authorName:   { type: String, required: true },
    authorAvatar: { type: String },
    category:     { type: String, required: true },
    tags:         [{ type: String }],
    imageUrl:     { type: String, default: '' },
    publishedAt:  { type: Date, default: Date.now },
    readTime:     { type: Number, default: 5 },
    likes:        { type: Number, default: 0 },
    comments:     { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model<IBlogPost>('BlogPost', BlogPostSchema);
