import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import NavBar from './navbar'; // Import the NavBar component
import Sidebar from './sidebar';
import React, { useEffect, useState } from 'react';

function History() {
    const [appointments, setAppointments] = useState([]);
    const [filteredAppointments, setFilteredAppointments] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState('');

    const fetchAppointments = async () => {
        try {
            const response = await fetch('http://localhost:3001/appointments');
            if (!response.ok) throw new Error('Failed to fetch appointments');
            const data = await response.json();

            // Filter confirmed appointments
            const confirmedAppointments = data.filter(appointment => appointment.status === 'Confirmed');

            setAppointments(confirmedAppointments);
            setFilteredAppointments(confirmedAppointments);
        } catch (error) {
            console.error('Error fetching appointments:', error);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    // Handle month selection
    const handleMonthChange = (event) => {
        const month = event.target.value;
        setSelectedMonth(month);

        if (month === '') {
            setFilteredAppointments(appointments);
        } else {
            const filtered = appointments.filter(appointment => {
                const appointmentMonth = new Date(appointment.date).getMonth(); // Get month (0-indexed)
                return appointmentMonth === parseInt(month);
            });
            setFilteredAppointments(filtered);
        }
    };

    return (
        <>
            <NavBar />
            <div className="card1">
                <Sidebar />
                <div className="card3">
                    <div className="his">
                        <h1>History</h1>

                        <select name="month" id="month" className='opt1' value={selectedMonth} onChange={handleMonthChange}>
                            <option value="">Select Month</option>
                            <option value="0">January</option>
                            <option value="1">February</option>
                            <option value="2">March</option>
                            <option value="3">April</option>
                            <option value="4">May</option>
                            <option value="5">June</option>
                            <option value="6">July</option>
                            <option value="7">August</option>
                            <option value="8">September</option>
                            <option value="9">October</option>
                            <option value="10">November</option>
                            <option value="11">December</option>
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
                                </tr>
                            </thead>
                            <tbody>
                                {filteredAppointments.length > 0 ? (
                                    filteredAppointments.map(appointment => (
                                        <tr className='tr1' key={appointment._id}>
                                            <td className='td1'>{appointment._id}</td>
                                            <td className='td1'>{appointment.appType}</td>
                                            <td className='td1'>{appointment.purpose}</td>
                                            <td className='td1'>{appointment.date}</td>
                                            <td className='td1'>{appointment.time}</td>
                                            <td className='td1'>{appointment.status}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className='text-center'>No Appointments</td>
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

export default History;
