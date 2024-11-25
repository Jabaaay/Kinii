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
  picture: String,
  position: String,
  role: {
    type: String,
    default: 'Admin'
  },
  resetPasswordCode: String,
  resetPasswordExpires: Date
});

export default mongoose.model('Admin', adminSchema);
