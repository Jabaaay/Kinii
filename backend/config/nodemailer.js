import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'universityguidance.noreply@gmail.com',
    pass: 'xfoy rlig vnbl jrlo'
  }
});

// Add error logging
transporter.verify((error, success) => {
  if (error) {
    console.error('SMTP connection error:', error);
  } else {
    console.log('Server is ready to send emails');
  }
}); 