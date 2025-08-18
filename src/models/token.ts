import { Schema, model, Types } from 'mongoose';

export interface IToken {
    token: string;
    userId: Types.ObjectId;
}


const tokenSchems = new Schema<IToken>({
    token: {
        type: String,
        required: true 
    },
    userId: {
        type: Schema.Types.ObjectId,
        required: true
    }
});

export default model<IToken>('Token',tokenSchems);

