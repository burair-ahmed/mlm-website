import mongoose, { Schema, model, models } from 'mongoose';

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  referralCode: {
    type: String,
    unique: true,
  },
  referrer: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  referrals: {
    type: [Schema.Types.ObjectId],
    ref: 'User',
    default: [],
  },
}, { timestamps: true });

const User = models.User || model('User', UserSchema);
export default User;
