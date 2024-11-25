import StudentApp from "../models/studentApp.js"
import Announcement from '../models/annoucementModels.js';
import Admin from "../models/admin.js";
import Concerns from '../models/concerns.js';
import Staff from '../models/staffModels.js';

// get all appointments by the student
const getHistory = async (req, res) => {
    try {
        const studentApp = await StudentApp.find();

        
        res.send(studentApp);

    } catch (error) {
        console.log(error)
    }
}


const confirmAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        await StudentApp.findByIdAndUpdate(id, { status: 'Confirmed' });
        res.status(200).json({ message: 'Appointment confirmed' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to confirm appointment' });
    }
};

const createAnnouncement = async (req, res) => {
  try {
      const { header, content } = req.body;
      let fileUrl = '';

      if (req.file) {
          fileUrl = req.file.path;  // File URL after upload
      }

      const announcement = new Announcement({ header, content, fileUrl });
      await announcement.save();
      res.status(201).json({ message: 'Announcement created successfully', announcement });
  } catch (error) {
      res.status(500).json({ error: 'An error occurred while creating the announcement' });
  }
};



const getAnnouncements = async (req, res) => {
    try {
        const announcements = await Announcement.find();
        res.status(200).json(announcements);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching announcements' });
    }
};

const handleGoogleLogin = async (req, res) => {
  const { googleId, name, email, picture, position} = req.body;

  try {
    let user = await Admin.findOne({ googleId });

    if (!user) {
      // Create a new user if they don't exist
      user = new Admin({ googleId, name, email, picture, position });
      await user.save();
    } else {
      // Update the existing user
      user.position = position || user.position;

      await user.save();
    }

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const updateProfile = async (req, res) => {
  const { googleId } = req.params; 
  const { position } = req.body; 

  try {
    
    const updatedUser = await Admin.findOneAndUpdate(
      { googleId },
      { position },
      { new: true }
    );

    
    if (!updatedUser) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    // Return the updated user data
    res.status(200).json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating profile' });
  }
};


const getNotifications = async (req, res) => {
  try {
    // Fetch notifications from the database
    const notifications = await Concerns.find(); // Adjust the query as needed (e.g., limit or filter)
    
    if (!notifications) {
      return res.status(404).json({ message: 'No notifications found' });
    }

    res.status(200).json(notifications); // Send notifications as a response
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const addStaff = async (req, res) => {
  const { fullName, email } = req.body;
  try {
    // Add staff to the database
    const newStaff = new Staff({ fullName, email });
    await newStaff.save();

    res.status(201).json({ message: 'Staff added successfully', data: newStaff });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};





export {getHistory, confirmAppointment, createAnnouncement, getAnnouncements, handleGoogleLogin, addStaff, updateProfile, getNotifications};