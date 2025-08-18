import { Schema, model, Types } from 'mongoose';

export interface ILike {
  blogId?: Types.ObjectId;
  userId?: Types.ObjectId;
  commentId?: Types.ObjectId;
}

const likeSchema = new Schema<ILike>({
  blogId: {
    type: Schema.Types.ObjectId,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  commentId: {
    type: Schema.Types.ObjectId,
  },
});

export default model<ILike>('Like', likeSchema);
