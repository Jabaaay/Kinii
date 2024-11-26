import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Staff from '../models/staffModels.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { fullName, email, password, role } = req.body;

    const existingStaff = await Staff.findOne({ email });
    
    if (existingStaff) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      
      existingStaff.fullName = fullName;
      existingStaff.password = hashedPassword;
      existingStaff.role = role;
      
      await existingStaff.save();

      const token = jwt.sign(
        { id: existingStaff._id, role: existingStaff.role },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );

      return res.status(200).json({
        success: true,
        message: 'Staff information updated successfully',
        token,
        staffId: existingStaff._id,
        isUpdate: true
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newStaff = new Staff({
      fullName,
      email,
      password: hashedPassword,
      role
    });

    await newStaff.save();

    const token = jwt.sign(
      { id: newStaff._id, role: newStaff.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(201).json({
      success: true,
      message: 'Staff registered successfully',
      token,
      staffId: newStaff._id,
      isUpdate: false
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing staff registration/update',
      error: error.message
    });
  }
});

export default router; 