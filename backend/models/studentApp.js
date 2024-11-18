import mongoose from "mongoose";
const {Schema} = mongoose;

    const studentSchema = new Schema({
        appType: {
            type: String,
            required: true
        },
        purpose: {
            type: String,
            required: true
        },
        date: {
            type: String,
            required: true
        },
        time: {
            type: String,
            required: true
        },
        status: { 
            type: String, 
            default: 'Waiting for Approval'
        },
        userName: { // New field for storing user's name
            type: String,
            required: true
        },
        department: {
            type: String,
            required: true
        }
    });
    

const studentModel = mongoose.model('student', studentSchema);
export default studentModel;
