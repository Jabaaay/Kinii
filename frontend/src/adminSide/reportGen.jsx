import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import NavBar from './adminNavbar.jsx';
import { useLocation } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import Swal from "sweetalert2";
import Sidebar from './adminSidebar.jsx';
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

function Dashboard() {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [selectedCollege, setSelectedCollege] = useState('');

  const fetchAppointments = async () => {
    try {
      const response = await fetch('http://localhost:3001/admin/appointments');
      if (!response.ok) throw new Error('Failed to fetch appointments');
      const data = await response.json();

      // Filter confirmed appointments initially
      const confirmedAppointments = data.filter(appointment => appointment.status === 'Confirmed');
      setAppointments(confirmedAppointments);
      setFilteredAppointments(confirmedAppointments); // Initially show all confirmed appointments
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  useEffect(() => {
    // Filter appointments based on selected college
    if (selectedCollege) {
      const filtered = appointments.filter(appointment => appointment.department === selectedCollege);
      setFilteredAppointments(filtered);
    } else {
      setFilteredAppointments(appointments); // If no college is selected, show all
    }
  }, [selectedCollege, appointments]);

  const handleCollegeChange = (event) => {
    setSelectedCollege(event.target.value);
  };

  const downloadPDF = async () => {
    const element = document.getElementById("appointment-table");
    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF();
    const imgWidth = 190;
    const pageHeight = 297;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let position = 10;

    pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
    pdf.save("appointments.pdf");
  };

  return (
    <>
      <NavBar />
      <div className="card1">
        <Sidebar />
        <div className="card3">
          <div className="his">
            <h1>Reports</h1>
            <select name="college" id="college-select" className="opt1" onChange={handleCollegeChange}>
              <option value="">Select College</option>
              <option value="COT">COT</option>
              <option value="COB">COB</option>
              <option value="CPAG">CPAG</option>
              <option value="CON">CON</option>
              <option value="COE">COE</option>
              <option value="CAS">CAS</option>
            </select>
          </div>

          <button className='download-btn' onClick={downloadPDF}>Download PDF</button>

          <div className="app">
            <table id="appointment-table" className="t1">
              <thead>
                <tr className="tr1">
                  <th className="th1">Name</th>
                  <th className="th1">College</th>
                  <th className="th1">Appointment Type</th>
                  <th className="th1">Purpose</th>
                  <th className="th1">Date</th>
                  <th className="th1">Time</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.length > 0 ? (
                  filteredAppointments.map(appointment => (
                    <tr className="tr1" key={appointment._id}>
                      <td className="td1">{appointment.userName}</td>
                      <td className="td1">{appointment.department}</td>
                      <td className="td1">{appointment.appType}</td>
                      <td className="td1">{appointment.purpose}</td>
                      <td className="td1">{appointment.date}</td>
                      <td className="td1">{appointment.time}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center">No Appointments</td>
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

export default Dashboard;
