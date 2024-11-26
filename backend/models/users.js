import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
const {Schema} = mongoose;

const userSchema = new Schema({
  googleId: {
    type: String,
    required: false,
    sparse: true,
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
    required: function() {
      return !this.googleId;
    }
  },
  picture: {
    type: String,
    default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
  },
  course: {
    type: String,
    default: ""
  },
  department: {
    type: String,
    default: ""
  },
  role: {
    type: String,
    enum: ['Student', 'Admin', 'Staff'],
    default: 'Student'
  },
  lastInviteSent: Date,
  inviteCount: {
    type: Number,
    default: 0
  },
  resetPasswordCode: String,
  resetPasswordExpires: Date
});

userSchema.pre('save', function(next) {
  if (this.isNew && !this.googleId) {
    this.googleId = uuidv4();
  }
  next();
});

export default mongoose.model('User', userSchema);