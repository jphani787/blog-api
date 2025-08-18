import { Schema, model } from 'mongoose';

import bcrypt from 'bcrypt';

export interface IUser {
  username: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  firstName?: string;
  lastName?: string;
  socialLinks?: {
    website?: string;
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    x?: string;
    youtube?: string;
  };
}

const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      minLength: [7, 'Username must be less then 20 characters'],
      unique: [true, 'Username must be unique'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      maxLength: [50, 'Email must be less then 50 characters'],
      unique: [true, 'Email must be unique'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      select: true,
    },
    role: {
      type: String,
      required: [true, 'Role is required'],
      enum: {
        values: ['admin', 'user'],
        message: '{VALUE} is not supported',
      },
      default: 'user',
    },
    firstName: {
      type: String,
      maxLength: [50, 'First name must be less then 50 characters'],
    },
    lastName: {
      type: String,
      maxLength: [20, 'Last name must be less then 20 characters'],
    },
    socialLinks: {
      website: {
        type: String,
        maxLength: [100, 'Website address must be less then 100 characters'],
      },
      facebook: {
        type: String,
        maxLength: [
          100,
          'Facebook profile uri must be less then 100 characters',
        ],
      },
      instagram: {
        type: String,
        maxLength: [
          100,
          'Instagram profile uri must be less then 100 characters',
        ],
      },
      linkedin: {
        type: String,
        maxLength: [
          100,
          'Linkedin profile uri must be less then 100 characters',
        ],
      },
      x: {
        type: String,
        maxLength: [100, 'X profile uri must be less then 100 characters'],
      },
      youtube: {
        type: String,
        maxLength: [
          100,
          'Youtube channel url must be less then 100 characters',
        ],
      },
    },
  },
  { timestamps: true },
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
    return;
  }

  this.password = await bcrypt.hash(this.password, 0);
  next();
});

export default model<IUser>('User', userSchema);
