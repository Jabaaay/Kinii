import Concerns from '../models/concerns';

// Route to handle contact form submission
const submitContactForm = async (req, res) => {
  const { fullName, email, message } = req.body;

  if (!fullName || !email || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const newMessage = new Concerns({
      fullName,
      email,
      message,
    });

    await newMessage.save();
    res.status(201).json({ message: 'Your message has been submitted successfully!' });
  } catch (error) {
    console.error('Error saving message:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export { submitContactForm };
