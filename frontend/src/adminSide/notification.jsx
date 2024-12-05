import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import NavBar from './adminNavbar';
import Sidebar from './adminSidebar';
import { format } from 'timeago.js';
import { MdDelete } from 'react-icons/md';

function Status() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [replyMessage, setReplyMessage] = useState('');

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
          const response = await fetch('http://localhost:3001/admin/contact');
          if (response.ok) {
              const data = await response.json();
              setNotifications(data);
          } else {
              console.error('Failed to fetch notifications');
          }
      } catch (error) {
          console.error('Error fetching notifications:', error);
      } finally {
          setLoading(false);
      }
  };

    fetchNotifications();
  }, []);

  const deleteNotification = async (id) => {
    try {
      const response = await fetch(`http://localhost:3001/admin/contact/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setNotifications((prev) => prev.filter((notif) => notif._id !== id));
        Swal.fire('Deleted!', 'Notification has been deleted.', 'success');
      } else {
        Swal.fire('Error!', 'Failed to delete notification.', 'error');
      }
    } catch (error) {
      Swal.fire('Error!', 'Error deleting notification.', 'error');
    }
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        deleteNotification(id);
      }
    });
  };

  const handleReply = async () => {
    try {
      const response = await fetch('http://localhost:3001/admin/contact/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedNotification._id,
          replyMessage,
        }),
      });
      if (response.ok) {
        Swal.fire('Success!', 'Reply sent successfully.', 'success');
        setSelectedNotification(null);
        setReplyMessage('');
      } else {
        Swal.fire('Error!', 'Failed to send reply.', 'error');
      }
    } catch (error) {
      Swal.fire('Error!', 'Error sending reply.', 'error');
    }
  };

  return (
    <>
      <NavBar />
      <div className="card1">
        <Sidebar />
        <div className="card3">
          <div className="notif-card">
            <p>Notifications</p>
          </div>
          {loading ? (
            <p>Loading notifications...</p>
          ) : notifications.length > 0 ? (
            notifications.map((notification) => (
              <div
                key={notification._id}
                className="message"
                onClick={() => setSelectedNotification(notification)}
                style={{ cursor: 'pointer' }}
              >
                <p className="notif-name">
                  <b>{notification.fullName}</b>
                </p>
                <p className="notif-msg">{notification.message}</p>
                <p className="notif-date">
                  <i>{format(notification.date)}</i>
                </p>
                <MdDelete
                  className="notif-del"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering the click for reply
                    handleDelete(notification._id);
                  }}
                  style={{ cursor: 'pointer' }}
                />
              </div>
            ))
          ) : (
            <p>No new notifications</p>
          )}
        </div>
      </div>

      {/* Reply Modal */}
      {selectedNotification && (
        <div className="modal">
          <div className="modal-content">
            <h3>Reply to {selectedNotification.fullName}</h3>
            <textarea
              rows="4"
              placeholder="Type your reply here..."
              value={replyMessage}
              className='txtArea'
              onChange={(e) => setReplyMessage(e.target.value)}
            ></textarea>
            <button onClick={handleReply}>Send Reply</button>
            <button onClick={() => setSelectedNotification(null)}>Cancel</button>
          </div>
        </div>
      )}
    </>
  );
}

export default Status;
