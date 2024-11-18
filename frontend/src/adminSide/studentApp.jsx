import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import NavBar from './adminNavbar';
import Sidebar from './adminSidebar';
import Pagination from 'react-bootstrap/Pagination';

function Status() {
    const [appointments, setAppointments] = useState([]);
    const [activeTab, setActiveTab] = useState('All'); // State for active tab

    // Fetch appointments
    const fetchAppointments = async () => {
        try {
            const response = await fetch('http://localhost:3001/admin/appointments'); // Your specified endpoint
            if (!response.ok) throw new Error('Failed to fetch appointments');
            const data = await response.json();
            setAppointments(data);
        } catch (error) {
            console.error('Error fetching appointments:', error);
        }
    };

    const handleConfirm = async (id) => {
        try {
            const response = await fetch(`http://localhost:3001/admin/confirm/${id}`, { method: 'PUT' });
            if (!response.ok) throw new Error('Failed to confirm appointment');
            
            // Update state by changing the status to "Confirmed"
            setAppointments(appointments.map(app => 
                app._id === id ? { ...app, status: 'Confirmed' } : app
            ));
            Swal.fire('Confirmed!', 'Your appointment has been confirmed.', 'success');
        } catch (error) {
            console.error('Error confirming appointment:', error);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    // Filter appointments based on active tab
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
                        <h1>Appointments</h1>
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
                                    <th className='th1'>Name</th>
                                    <th className='th1'>College</th>
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
                                            <td className='td1'>{appointment.userName}</td> {/* Display Name */}
                                            <td className='td1'>{appointment.department}</td>
                                            <td className='td1'>{appointment.appType}</td>
                                            <td className='td1'>{appointment.purpose}</td>
                                            <td className='td1'>{appointment.date}</td>
                                            <td className='td1'>{appointment.time}</td>
                                            <td className='td1'>{appointment.status}</td>
                                            <td className='td1'>
                                                {appointment.status !== 'Confirmed' && (
                                                    <button 
                                                        className='con' 
                                                        onClick={() => handleConfirm(appointment._id)}
                                                    >
                                                        Confirm
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="8" className='text-center'>No Appointments</td>
                                    </tr>
                                )}
                            </tbody>

                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Status;
