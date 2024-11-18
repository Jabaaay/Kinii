import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import NavBar from './navbar';
import Sidebar from './sidebar';
import React, { useEffect, useState } from 'react';
import Swal from "sweetalert2";
import { MdEdit, MdDelete } from "react-icons/md";


function Dashboard() {
    const [userData, setUserData] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
    const [isEditing, setIsEditing] = useState(false);
    const [editAppointment, setEditAppointment] = useState(null);

    const navigate = useNavigate();

    const fetchPendingAppointments = async () => {
        try {
            // Fetch appointments data from the server
            const response = await fetch('http://localhost:3001/appointments');
            if (!response.ok) throw new Error('Failed to fetch appointments');
            const data = await response.json();
    
            // Filter for pending appointments only
            const pendingAppointments = data.filter(appointment => appointment.status === 'Waiting for Approval');
            setAppointments(pendingAppointments);
        } catch (error) {
            console.error('Error fetching pending appointments:', error);
        }
    };
    
    useEffect(() => {
        fetchPendingAppointments();
    }, []);

    


    useEffect(() => {
        const storedUser = sessionStorage.getItem('userInfo');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUserData(parsedUser);
        } else {
            navigate('/login');
        }
    }, [navigate]);

    const [newStudentApp, setNewStudentApp] = useState({
        appType: '',
        purpose: '',
        date: '',
        time: '',
    });

    const handleInputChange = (e) => {
        const { name, department, value } = e.target;
        setNewStudentApp((prev) => ({
            ...prev,
            [name]: value,
            [department]: value,
        }));
    };

    const handleAddStudentApp = async (e) => {
        e.preventDefault();
        try {
            // Add userName field from userData
            const newAppointment = {
                ...newStudentApp,
                userName: userData?.name, // Include user name from session data
                department: userData?.department
            };
    
            const response = await fetch('http://localhost:3001/appointments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newAppointment)
            });
    
            if (!response.ok) {
                throw new Error('Failed');
            }
    
            await fetchPendingAppointments(); // Fetch updated appointments
            setNewStudentApp({ appType: '', purpose: '', date: '', time: '' });
            setIsModalOpen(false); // Close the modal after adding the appointment
        } catch (error) {
            console.error('Error:', error);
        }
    };
    

    const onAppointment = () => {
        Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Just Wait for the Approval',
            confirmButtonText: 'OK',
            confirmButtonColor: '#FFB703',
            customClass: {
                confirmButton: 'swal-btn'
            }
        }).then(() => {
            navigate("/dashboard");
        });
    };

    const handleDelete = async (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "This will delete the appointment!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await fetch(`http://localhost:3001/appointments/${id}`, {
                        method: 'DELETE',
                    });
                    if (!response.ok) throw new Error('Failed to delete appointment');
                    setAppointments(appointments.filter(app => app._id !== id));
                    Swal.fire('Deleted!', 'Your appointment has been deleted.', 'success');
                } catch (error) {
                    console.error("Error deleting appointment:", error);
                }
            }
        });
    };

    const handleEdit = (appointment) => {
        setIsEditing(true);
        setEditAppointment(appointment);
    };

    const handleEditSubmit = async () => {
        try {
            const response = await fetch(`http://localhost:3001/appointments/${editAppointment._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editAppointment),
            });
            if (!response.ok) throw new Error('Failed to update appointment');

            const updatedAppointments = appointments.map(app =>
                app._id === editAppointment._id ? editAppointment : app
            );
            setAppointments(updatedAppointments);
            setIsEditing(false);
            Swal.fire('Updated!', 'Your appointment has been updated.', 'success');
        } catch (error) {
            console.error("Error updating appointment:", error);
        }
    };



    return (
        <>
            <NavBar />
            <div className="card1">
                <Sidebar />
                <div className="card3">
                    <h1>Hello, {userData?.name}!👋</h1>
                    <div className="add">
                        <h2 className='my'>My Appointment</h2>
                        <button className='add-new' onClick={() => setIsModalOpen(true)}>Add New Appointment</button> {/* Open modal */}
                    </div>
                    <div className="app">
                    <table className='t1'>
                        <thead>
                            <tr className='tr1'>
                                <th className='th1'>ID</th>
                                <th className='th1'>Appointment Type</th>
                                <th className='th1'>Purpose</th>
                                <th className='th1'>Date</th>
                                <th className='th1'>Time</th>
                                <th className='th1'>Status</th>
                                <th className='th1'>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
    {appointments.length > 0 ? (
        appointments.map((appointment) => (
            <tr key={appointment.id} className='tr1'>
                <td className='td1'>{appointment._id}</td> {/* Optional: Display an incrementing index */}
                <td className='td1'>{appointment.appType}</td>
                <td className='td1'>{appointment.purpose}</td>
                <td className='td1'>{appointment.date}</td>
                <td className='td1'>{appointment.time}</td>
                <td className='td1'>{appointment.status}</td>
                <td className='td1'>
    <>
    <div className="act">
        <MdEdit className='edit' onClick={() => handleEdit(appointment)} />
        <MdDelete className='del' onClick={() => handleDelete(appointment._id)} />
            </div>
    </>

                                            </td>
            </tr>
        ))
    ) : (
        <tr>
            <td colSpan="7" className='td1'>No Appointments</td>
        </tr>
    )}
</tbody>

                    </table>
                    </div>
                    {isEditing && (
                            <div className="modal">
                                <div className="modal-content">
                                    <h2>Edit Appointment</h2>
                                    <label>Appointment Type</label>

                                    <select className='time' name="appType" value={editAppointment.appType} onChange={(e) => setEditAppointment({ ...editAppointment, appType: e.target.value })}>
                                    <option value="">Select Type</option>
                                    <option value="Individual">Individual</option>
                                    <option value="Group">Group</option>
                                </select>
                            
                                <label>Purpose</label>

                                <select className='time' name="purpose" value={editAppointment.purpose} onChange={(e) => setEditAppointment({ ...editAppointment, purpose: e.target.value })}>
                                    <option value="">Select a purpose</option>
                                    <option value="Academic Counseling">Academic Counseling</option>
                                    <option value="Emotional Support">Emotional Support</option>
                                    <option value="Career Guidance">Career Guidance</option>
                                    <option value="Behavioral Concerns">Behavioral Concerns</option>
                                </select>


                                    <label>Date</label>
                                    <input
                                        type="date"
                                        value={editAppointment.date}
                                        onChange={(e) => setEditAppointment({ ...editAppointment, date: e.target.value })}
                                    />
                                    <label>Time</label>
                                
                                <select className='time' name="time" value={editAppointment.time}
                                        onChange={(e) => setEditAppointment({ ...editAppointment, time: e.target.value })}>
                                    <option value="">Select a time slot</option>
                                    <option value="8 - 9:00am">8 - 9:00 am</option>
                                    <option value="9 - 10:00am">9 - 10:00 am</option>
                                    <option value="10 - 11:00am">10 - 11:00 am</option>
                                    <option value="1 - 2:00pm">1 - 2:00 pm</option>
                                    <option value="2 - 3:00pm">2 - 3:00 pm</option>
                                    <option value="3 - 4:00pm">3 - 4:00 pm</option>
                                </select>
                           
                                    <button onClick={handleEditSubmit}>Save</button>
                                    <button onClick={() => setIsEditing(false)}>Cancel</button>
                                </div>
                            </div>
                        )}


                  
                    {isModalOpen && (
                        <div className="modal app">
                            <form onSubmit={handleAddStudentApp}>
                                <div className="app">
                                    <div className="type">
                                        <h2>Select Appointment Type: </h2>
                                        <div className="input1">
                                            <select className='dropdown' name="appType" value={newStudentApp.appType} onChange={handleInputChange}>
                                                <option value="">Select Type</option>
                                                <option value="Individual">Individual</option>
                                                <option value="Group">Group</option>
                                            </select>
                                        </div><br /><br />

                                        <h2>Purpose: </h2>
                                        <div className="input1">
                                            <select className='dropdown' name="purpose" value={newStudentApp.purpose} onChange={handleInputChange}>
                                                <option value="">Select a purpose</option>
                                                <option value="Academic Counseling">Academic Counseling</option>
                                                <option value="Emotional Support">Emotional Support</option>
                                                <option value="Career Guidance">Career Guidance</option>
                                                <option value="Behavioral Concerns">Behavioral Concerns</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="purpose">
                                        <h2>Select Date and Time</h2>
                                        <div className="input1">
                                            <input className='dropdown' type="date" name='date' value={newStudentApp.date} onChange={handleInputChange} />
                                        </div>
                                        <div className="input1">
                                            <select className='dropdown' name="time" value={newStudentApp.time} onChange={handleInputChange}>
                                                <option value="">Select a time slot</option>
                                                <option value="8 - 9:00am">8 - 9:00 am</option>
                                                <option value="9 - 10:00am">9 - 10:00 am</option>
                                                <option value="10 - 11:00am">10 - 11:00 am</option>
                                                <option value="1 - 2:00pm">1 - 2:00 pm</option>
                                                <option value="2 - 3:00pm">2 - 3:00 pm</option>
                                                <option value="3 - 4:00pm">3 - 4:00 pm</option>
                                            </select>
                                        </div>
                                    </div>
                                    
                                </div>
                                <div className="div-btn">
                                <button className='div-btns' onClick={onAppointment}>Confirm</button>
                                <button type="button" className='div-btns' onClick={() => setIsModalOpen(false)}>Cancel</button>
                                </div>
                              
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default Dashboard;
