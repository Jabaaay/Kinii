import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import NavBar from './navbar';
import Sidebar from './sidebar';
import { MdEdit, MdDelete } from "react-icons/md";
import Swal from 'sweetalert2';

function Status() {
    const [appointments, setAppointments] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editAppointment, setEditAppointment] = useState(null);
    const [activeTab, setActiveTab] = useState('All'); // State for active tab


    const fetchAppointments = async () => {
        try {
            const response = await fetch('http://localhost:3001/appointments');
            if (!response.ok) throw new Error('Failed to fetch appointments');
            const data = await response.json();
            setAppointments(data);
        } catch (error) {
            console.error('Error fetching appointments:', error);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

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

    const filteredAppointments = appointments.filter(app => {
        if (activeTab === 'All') return true;
        if (activeTab === 'Pending') return app.status !== 'Confirmed';
        if (activeTab === 'Confirmed') return app.status === 'Confirmed';
        return true;
    });


    return (
        <>
            <NavBar />
            <div className="card1">
                <Sidebar />
                <div className="card3">
                    <div className="his">
                <h1>Status</h1>
        <select
                        onChange={(e) => setActiveTab(e.target.value)}
                        value={activeTab} // Set current value based on state
                        className='opt1' 
                    >
                        <option value="All">All</option>
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                    </select>

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
                            {filteredAppointments.length > 0 ? (
                                    filteredAppointments.map((appointment) => (
                                        <tr className='tr1' key={appointment._id}>
                                            <td className='td1'>{appointment._id}</td>
                                            <td className='td1'>{appointment.appType}</td>
                                            <td className='td1'>{appointment.purpose}</td>
                                            <td className='td1'>{appointment.date}</td>
                                            <td className='td1'>{appointment.time}</td>
                                            <td className='td1'>{appointment.status}</td>
                                            <td className='td1'>
                                                <div className="act">
                                                {appointment.status !== 'Confirmed' && (
    <>
        <MdEdit className='edit' onClick={() => handleEdit(appointment)} />
        <MdDelete className='del' onClick={() => handleDelete(appointment._id)} />
    </>
)}

                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className='text-center'>No Appointments</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
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
                    </div>
                </div>
            </div>
        </>
    );
}

export default Status;
