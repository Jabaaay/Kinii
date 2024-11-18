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
  role: 
  { 
    type: String, 
    default: 'Staff' },
});

const Staff = mongoose.model('Staff', staffSchema);

export default Staff;

