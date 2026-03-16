import mongoose, { Document, Schema } from 'mongoose';

interface IComment {
  userId: mongoose.Types.ObjectId;
  userName: string;
  content: string;
  createdAt: Date;
}

export interface ICommunityPost extends Document {
  userId: mongoose.Types.ObjectId;
  userName: string;
  userAvatar?: string;
  content: string;
  imageUrl?: string;
  likes: number;
  likedBy: mongoose.Types.ObjectId[];
  comments: IComment[];
  tags: string[];
}

const CommentSchema = new Schema<IComment>({
  userId:    { type: Schema.Types.ObjectId, ref: 'User', required: true },
  userName:  { type: String, required: true },
  content:   { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
}, { _id: true });

const CommunityPostSchema = new Schema<ICommunityPost>(
  {
    userId:     { type: Schema.Types.ObjectId, ref: 'User', required: true },
    userName:   { type: String, required: true },
    userAvatar: { type: String },
    content:    { type: String, required: true },
    imageUrl:   { type: String },
    likes:      { type: Number, default: 0 },
    likedBy:    [{ type: Schema.Types.ObjectId, ref: 'User' }],
    comments:   [CommentSchema],
    tags:       [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.model<ICommunityPost>('CommunityPost', CommunityPostSchema);
