import mongoose from 'mongoose';
const {Schema} = mongoose;

const adminSchema = new Schema({
  googleId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  picture: String,
  position: String,
  role: {
    type: String,
    enum: ['Admin', 'Staff'],
    default: 'Admin'
  },
  resetPasswordCode: String,
  resetPasswordExpires: Date
});

export default mongoose.model('Admin', adminSchema);
