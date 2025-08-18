import { Schema, model, Types } from 'mongoose';

export interface IComment {
  blogId?: Types.ObjectId;
  userId?: Types.ObjectId;
  content: string;
}

const commentSchema = new Schema<IComment>({
  blogId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
    maxLength: [100, 'Youtube channel url must be less then 100 characters'],
  },
});

export default model<IComment>('Comment', commentSchema);
