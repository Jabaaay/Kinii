import mongoose from "mongoose";
const {Schema} = mongoose;

const announcementSchema = new Schema({
    header: { type: String, required: true },
    content: { type: String, required: true },
    fileUrl: { type: String },
    createdAt: { type: Date, default: Date.now }
});

const announcementModel = mongoose.model('announcements', announcementSchema);
export default announcementModel;
