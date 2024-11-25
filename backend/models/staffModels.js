import mongoose from 'mongoose';
const {Schema} = mongoose;

const staffSchema = new Schema({
  fullName: 
  { 
    type: String, 
    required: true 
},
  email: 
  { 
    type: String, 
    required: true, 
    unique: true 
},
  position: 
  { 
    type: String, 
    required: true 
},
  role: 
  { 
    type: String, 
    default: 'Staff' },
  lastInviteSent: {
    type: Date,
    default: Date.now
  },
  inviteCount: {
    type: Number,
    default: 1
  },
  resetPasswordCode: String,
  resetPasswordExpires: Date
});

const Staff = mongoose.model('Staff', staffSchema);

export default Staff;

