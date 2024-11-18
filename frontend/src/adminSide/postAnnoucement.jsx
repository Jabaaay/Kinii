import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from './adminNavbar';
import Sidebar from './adminSidebar';
import Swal from 'sweetalert2';

function Status() {
    const [header, setHeader] = useState('');
    const [content, setContent] = useState('');
    const [file, setFile] = useState(null);
    const [announcements, setAnnouncements] = useState([]);

    useEffect(() => {
        // Fetch existing announcements
        const fetchAnnouncements = async () => {
            try {
                const response = await fetch('http://localhost:3001/admin/announcements');
                if (response.ok) {
                    const data = await response.json();
                    setAnnouncements(data);
                }
            } catch (error) {
                console.error('Error fetching announcements:', error);
            }
        };
        fetchAnnouncements();
    }, []);
    

    const handlePost = async () => {
        const formData = new FormData();
        formData.append('header', header);
        formData.append('content', content);
        if (file) formData.append('file', file);

        try {
            const response = await fetch('http://localhost:3001/admin/announcements', {
                method: 'POST',
                body: formData,
            });
            
            if (response.ok) {
                const newAnnouncement = await response.json();
                setAnnouncements((prev) => [...prev, newAnnouncement]);
                setHeader('');
                setContent('');
                setFile(null);

                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Announcement posted successfully!',
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error posting announcement.',
                });
            }
        } catch (error) {
            console.error('Error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'An error occurred while posting the announcement.',
            });
        }
    };

    return (
        <>
            <NavBar />
            <div className="card1">
                <Sidebar />
                <div className="card3">
                    <h1>Post Announcement</h1>
                    <div className="app">
                        <div className="addStaff">
                            <input
                                type="text"
                                className='inp1'
                                placeholder='Header'
                                value={header}
                                onChange={(e) => setHeader(e.target.value)}
                                required
                            />
                            <textarea
                                className='txtArea'
                                placeholder='Content'
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                            ></textarea>
                            <input
                                type="file"
                                className="inp1"
                                accept="image/*"  // This ensures only image files are shown in the file picker
                                onChange={(e) => setFile(e.target.files[0])}
                            />
                            <br /><br /><br /><br />
                            <button className='con' onClick={handlePost}>Post</button>
                        </div>
                    </div>
                  
                </div>
            </div>
        </>
    );
}

export default Status;
