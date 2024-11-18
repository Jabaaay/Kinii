import { useNavigate } from 'react-router-dom';
import logo from './assets/book.png';
import logo1 from './assets/1.png';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2'; // Import SweetAlert2

const LandingPage = () => {
  const navigate = useNavigate();
  const [announcements, setAnnouncements] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const [loading, setLoading] = useState(true); // New loading state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const contactData = { fullName, email, message };

    try {
      const response = await fetch('http://localhost:3001/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactData),
      });

      const data = await response.json();

      if (response.ok) {
        // Success alert
        Swal.fire({
          title: 'Success!',
          text: data.message,
          icon: 'success',
          confirmButtonText: 'OK'
        });
        setFullName('');
        setEmail('');
        setMessage('');
      } else {
        // Error alert
        Swal.fire({
          title: 'Error!',
          text: data.error || 'Something went wrong.',
          icon: 'error',
          confirmButtonText: 'Try Again'
        });
      }
    } catch (error) {
      console.error('Error:', error);
      // Network error alert
      Swal.fire({
        title: 'Network Error!',
        text: 'Please try again later.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  useEffect(() => {
    // Fetch existing announcements
    const fetchAnnouncements = async () => {
      try {
        const response = await fetch('http://localhost:3001/admin/announcements');
        if (response.ok) {
          const data = await response.json();
          setAnnouncements(data);
        } else {
          console.error('Failed to fetch announcements');
        }
      } catch (error) {
        console.error('Error fetching announcements:', error);
      } finally {
        setLoading(false); // Stop loading after fetch attempt
      }
    };

    fetchAnnouncements();
  }, []);

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const visibleAnnouncements = showMore ? announcements : announcements.slice(0, 4);

  return (
    <>
      <motion.nav>
        <div className="logo">
          <motion.img src={logo1} alt="logo" whileHover={{ scale: 1.1 }} />
        </div>
        <ul className="order-list">
          {['Home', 'Announcements', 'Contact Us'].map((section) => (
            <motion.li
              key={section}
              onClick={() => scrollToSection(`${section.toLowerCase().replace(' ', '-')}-section`)}
            >
              {section}
            </motion.li>
          ))}
        </ul>
      </motion.nav>

      <motion.section
        id="home-section"
        className="section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className='landing-page'>
          <div className="content" id='home-section'>
            <motion.h1
              className="buksu"
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <b>BukSU Guidance</b>
            </motion.h1>
            <motion.p
              className="cont"
              initial={{ x: -100 }}
              animate={{ x: 0 }}
              transition={{ duration: 0.7 }}
            >
              The BukSU Guidance Center assists the University in implementing quality programs and activities
            </motion.p>
            <motion.button
              className="login-button"
              onClick={handleLoginClick}
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.7 }}
              whileHover={{ scale: 1.05, backgroundColor: '#3498db' }}
            >
              Log In
            </motion.button>
          </div>
          <motion.div
            className="logo1"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            whileHover={{ scale: 1.1 }}
          >
            <img src={logo} alt="logo1" />
          </motion.div>
        </div>
      </motion.section>

      <motion.section
        id="announcements-section"
        className="section"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <h1 className="ann">Announcements</h1>
        <div className="an">
          {loading ? ( // Conditional rendering for loading state
            <p>Loading announcements...</p>
          ) : (
            visibleAnnouncements.length > 0 ? (
              visibleAnnouncements.map((announcement, index) => (
                <motion.div
                  key={announcement._id}
                  className="announcement-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  {announcement.fileUrl && (
                    <motion.img
                      className="images"
                      src={`http://localhost:3001/${announcement.fileUrl}`} // Serve from 'uploads' folder
                      alt="announcement"
                      whileHover={{ scale: 1.1 }}
                    />
                  )}
                  <p className="heads">{announcement.header}</p>
                  <p className="conts">{announcement.content}</p>
                </motion.div>
              ))
            ) : (
              <p>No announcements available</p>
            )
          )}
        </div>

        {announcements.length > 4 && !showMore && (
          <button className="see-more-button" onClick={() => setShowMore(true)}>
            See More
          </button>
        )}

        {showMore && announcements.length > 4 && (
          <button className="see-more-button" onClick={() => setShowMore(false)}>
            See Less
          </button>
        )}
      </motion.section>

      <motion.section
        id="contact-section"
        className="section"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <br />
        <br />
        <br />
        <h1 className="ann">Contact Us</h1>
        <div className="contact-form">
          <div className="card-info">
          <p>If you have any questions or concerns regarding your appointment scheduling, rest assured that our dedicated support team is here to assist you every step of the way. Whether you need clarification on appointment details, assistance with rescheduling, or help resolving any issues that may arise, we're committed to providing you with prompt and reliable support. Your convenience is our top priority, and we strive to ensure that your scheduling experience with us is smooth and hassle-free. Don't hesitate to reach out to us via email, phone, or live chat – we're always ready to help address any queries or concerns you may have.</p>
          </div>
          <div className="card-message">
            <h1>Send Us Message</h1>
            <input
              type="text"
              className="contact-input"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
            <input
              type="email"
              className="contact-input"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <textarea
              className="contact-input"
              placeholder="Message"
              rows="6"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            ></textarea>
            <button className="contact-btn" onClick={handleSubmit}>
              Submit
            </button>
          </div>
        </div>
      </motion.section>

      <footer className="footer">
        <motion.div className="footer-content">
          
          <p>Bukidnon State University<a href="">Fortich St., Malaybalay City, Bukidnon</a></p>
        </motion.div>
      </footer>
    </>
  );
};

export default LandingPage;
