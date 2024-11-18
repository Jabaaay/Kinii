import mongoose from 'mongoose';
const {Schema} = mongoose;


const adminSchema = new Schema({
  googleId: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  picture: { type: String },
  position: { type: String },
  role: { type: String, default: 'Admin' },
});

const Admin = mongoose.model('Admin', adminSchema);
export default Admin;
