import mongoose from 'mongoose';
const {Schema} = mongoose;


const userSchema = new Schema({
  googleId: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  picture: { type: String },
  course: { type: String },
  department: { type: String },
  role: { type: String, default: 'Student' },
});

const User = mongoose.model('User', userSchema);
export default User;
