import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import NavBar from './navbar'; // Import the NavBar component
import Sidebar from './sidebar';
import React, { useEffect, useState } from 'react';




function History() {

  const [appointments, setAppointments] = useState([]);
   

    const fetchAppointments = async () => {
      try {
          const response = await fetch('http://localhost:3001/appointments');
          if (!response.ok) throw new Error('Failed to fetch appointments');
          const data = await response.json();
  
          // Filter confirmed appointments
          const confirmedAppointments = data.filter(appointment => appointment.status === 'Confirmed');
  
          setAppointments(confirmedAppointments);
      } catch (error) {
          console.error('Error fetching appointments:', error);
      }
  };
  

    useEffect(() => {
        fetchAppointments();
    }, []);   
  return (
  
    <>
    <NavBar />
  <div className="card1">
  <Sidebar />
    <div className="card3">

      <div className="his">
        <h1>History</h1>

        <select name="" id="" className='opt1'>
                                    <option value="">Select Month</option>
                                    <option value="">Jan 1 - Dec 31 2020</option>
                                    <option value="">Jan 1 - Dec 31 2021</option>
                                    <option value="">Jan 1 - Dec 31 2022</option>
                                    <option value="">Jan 1 - Dec 31 2023</option>
                                    <option value="">Jan 1 - Dec 31 2024</option>
                                    <option value="">Jan 1 - Dec 31 2025</option>
                                    
                                </select>

        </div>

        <div className="app">
        <table className='t1'>
                <tr className='tr1'>
                <th className='th1'>ID</th>
                  <th className='th1'>Appointment Type</th>
                  <th className='th1'>Purpose</th>
                  <th className='th1'>Date</th>
                  <th className='th1'>Time</th>
                  <th className='th1'>Status</th>
                </tr>
                <tbody>
                                {appointments.length > 0 ? (
                                    appointments.map(appointment => (
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
                                        <td colSpan="7" className='text-center'>No Appointments</td>
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
