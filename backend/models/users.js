import mongoose from 'mongoose';
const {Schema} = mongoose;

const userSchema = new Schema({
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
  course: String,
  department: String,
  role: {
    type: String,
    default: 'Student'
  }
});

export default mongoose.model('User', userSchema);