import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import NavBar from './adminNavbar.jsx';
import Sidebar from './adminSidebar.jsx';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Pie, PieChart, Cell } from 'recharts';

const Dashboard = () => {
    const [pendingAppointments, setPendingAppointments] = useState([]);
    const [confirmedAppointments, setConfirmedAppointments] = useState([]);
    const [totalAppointments, setTotalAppointments] = useState(0);
    const [loading, setLoading] = useState(true); // Loading state added
    const [selectedMonth, setSelectedMonth] = useState(''); // State to track selected month

    // Fetch appointments and categorize them
    const fetchAppointments = async () => {
        try {
            setLoading(true); // Start loading
            const response = await fetch('http://localhost:3001/admin/appointments');
            if (!response.ok) {
                throw new Error('Failed to fetch appointments');
            }
            const data = await response.json();

            // Filter appointments by status
            const pending = data.filter(appointment => appointment.status === 'Waiting for Approval');
            const confirmed = data.filter(appointment => appointment.status === 'Confirmed');

            setPendingAppointments(pending);
            setConfirmedAppointments(confirmed);
            setTotalAppointments(data.length);
        } catch (error) {
            console.error('Error fetching appointments:', error);
        } finally {
            setLoading(false); // Stop loading
        }
    };

    useEffect(() => {
        fetchAppointments(); // Fetch appointments on component mount
    }, []);

    // Filter appointments based on the selected month
    const filteredAppointments = confirmedAppointments.filter(appointment => {
        if (!selectedMonth) return true; // Show all if no month selected
        const appointmentMonth = new Date(appointment.date).toLocaleString('en-US', { month: 'long' });
        return appointmentMonth === selectedMonth;
    });

    // List of all departments (add any missing departments here)
const allDepartments = ['CPAG', 'COB', 'COE', 'CAS', 'CON', 'COT'];

// Prepare data for charts by grouping by department
const aggregatedData = filteredAppointments.reduce((acc, appointment) => {
    const department = appointment.department || 'Unknown';
    if (!acc[department]) {
        acc[department] = 0;
    }
    acc[department] += appointment.count || 1; // Increment count for each appointment
    return acc;
}, {});

// Only include departments that have appointments (count > 0)
const data = allDepartments.map(department => ({
    name: department,
    Appointments: aggregatedData[department] || 0, // Set to 0 if no appointments
}));

const data02 = Object.keys(aggregatedData)
    .filter(department => aggregatedData[department] > 0)  // Filter departments with count > 0
    .map(department => ({
        name: department,
        value: aggregatedData[department],
    }));



    const colors = ['#09b393', '#f5e642', '#4275f5', '#00ff0d', '#f542c8', '#f54242'];

    return (
        <>
            <NavBar />
            <div className="card1">
                <Sidebar />
                <div className="card3">
                    {loading ? (
                        <div className="loading-indicator">
                            <h2>Loading...</h2> {/* Replace with a spinner or more complex loading indicator if desired */}
                        </div>
                    ) : (
                        <>
                            <div className="dis">
                                <div className="dash"> 
                                    <h2 className='da2'>Confirmed</h2>
                                    <h1 className='da'>{confirmedAppointments.length}</h1>
                                </div>
                                <div className="dash"> 
                                    <h2 className='da2'>Pending</h2>
                                    <h1 className='da'>{pendingAppointments.length}</h1>
                                </div>
                                <div className="dash"> 
                                    <h2 className='da2'>Total Appointments</h2>
                                    <h1 className='da'>{totalAppointments}</h1>
                                </div>
                            </div>
                            <br />
                            <div className="div-chart">
                                <div className="dat">
                                    <div className="head">
                                        <div className="char">
                                            <h1>Chart</h1>
                                        </div>
                                        <div className="opt">
                                            <select className='opt1' value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
                                                <option value="">Select Month</option>
                                                <option value="January">January</option>
                                                <option value="February">February</option>
                                                <option value="March">March</option>
                                                <option value="April">April</option>
                                                <option value="May">May</option>
                                                <option value="June">June</option>
                                                <option value="July">July</option>
                                                <option value="August">August</option>
                                                <option value="September">September</option>
                                                <option value="October">October</option>
                                                <option value="November">November</option>
                                                <option value="December">December</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="bod">
                                        <div className="chart">
                                            <ResponsiveContainer width="100%" height={400}>
                                                <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: -30 }}>
                                                    <CartesianGrid strokeDasharray="3 3" />
                                                    <XAxis dataKey="name" />
                                                    <YAxis />
                                                    <Tooltip />
                                                    <Legend />
                                                    <Line type="monotone" dataKey="Appointments" stroke="#8884d8" activeDot={{ r: 5 }} />
                                                </LineChart>
                                            </ResponsiveContainer>
                                        </div>
                                        <div className="chartss">
                                            <ResponsiveContainer width="100%" height={330}>
                                                <PieChart>
                                                    <Pie data={data02} dataKey="value" cx="50%" cy="50%" outerRadius={95} fill="#8884d8" label={({ name, value }) => `${name}: ${value}`}>
                                                        {data02.map((entry, index) => (
                                                            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                                                        ))}
                                                    </Pie>
                                                </PieChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default Dashboard;
