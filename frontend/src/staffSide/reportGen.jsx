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
  const [isExporting, setIsExporting] = useState(false);

  const fetchAppointments = async () => {
    try {
      const response = await fetch('http://localhost:3001/staff/appointments');
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

  const exportToGoogleSheets = async () => {
    setIsExporting(true);
    try {
      const sheetData = filteredAppointments.map(appointment => [
        appointment.userName,
        appointment.department,
        appointment.appType,
        appointment.purpose,
        appointment.date,
        appointment.time
      ]);

      const response = await fetch('http://localhost:3001/staff/export-to-sheets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: sheetData }),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to export to Google Sheets');
      }

      const { spreadsheetUrl } = await response.json();

      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Data exported to Google Sheets successfully!',
        confirmButtonText: 'Open Spreadsheet',
        showCancelButton: true,
      }).then((result) => {
        if (result.isConfirmed && spreadsheetUrl) {
          window.open(spreadsheetUrl, '_blank');
        }
      });

    } catch (error) {
      console.error('Error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Export Failed',
        text: 'Failed to export data to Google Sheets',
      });
    } finally {
      setIsExporting(false);
    }
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

          <div className="button-container">
            <button className="download-btn" onClick={downloadPDF}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 0a8 8 0 0 0-8 8 8 8 0 0 0 8 8 8 8 0 0 0 8-8 8 8 0 0 0-8-8zm0 14a6 6 0 1 1 0-12 6 6 0 0 1 0 12zm1-7h2v2H9v2H7v-2H5V7h2V5h2v2z"/>
              </svg>
              Download PDF
            </button>
            
            <button 
              className="download-btn" 
              onClick={exportToGoogleSheets}
              disabled={isExporting}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5v2z"/>
                <path d="M4.603 14.087a.81.81 0 0 1-.438-.42c-.195-.388-.13-.776.08-1.102.198-.307.526-.568.897-.787a7.68 7.68 0 0 1 1.482-.645 19.697 19.697 0 0 0 1.062-2.227 7.269 7.269 0 0 1-.43-1.295c-.086-.4-.119-.796-.046-1.136.075-.354.274-.672.65-.823.192-.077.4-.12.602-.077a.7.7 0 0 1 .477.365c.088.164.12.356.127.538.007.188-.012.396-.047.614-.084.51-.27 1.134-.52 1.794a10.954 10.954 0 0 0 .98 1.686 5.753 5.753 0 0 1 1.334.05c.364.066.734.195.96.465.12.144.193.32.2.518.007.192-.047.382-.138.563a1.04 1.04 0 0 1-.354.416.856.856 0 0 1-.51.138c-.331-.014-.654-.196-.933-.417a5.712 5.712 0 0 1-.911-.95 11.651 11.651 0 0 0-1.997.406 11.307 11.307 0 0 1-1.02 1.51c-.292.35-.609.656-.927.787a.793.793 0 0 1-.58.029zm1.379-1.901c-.166.076-.32.156-.459.238-.328.194-.541.383-.647.547-.094.145-.096.25-.04.361.01.022.02.036.026.044a.266.266 0 0 0 .035-.012c.137-.056.355-.235.635-.572a8.18 8.18 0 0 0 .45-.606zm1.64-1.33a12.71 12.71 0 0 1 1.01-.193 11.744 11.744 0 0 1-.51-.858 20.801 20.801 0 0 1-.5 1.05zm2.446.45c.15.163.296.3.435.41.24.19.407.253.498.256a.107.107 0 0 0 .07-.015.307.307 0 0 0 .094-.125.436.436 0 0 0 .059-.2.095.095 0 0 0-.026-.063c-.052-.062-.2-.152-.518-.209a3.876 3.876 0 0 0-.612-.053zM8.078 7.8a6.7 6.7 0 0 0 .2-.828c.031-.188.043-.343.038-.465a.613.613 0 0 0-.032-.198.517.517 0 0 0-.145.04c-.087.035-.158.106-.196.283-.04.192-.03.469.046.822.024.111.054.227.09.346z"/>
              </svg>
              {isExporting ? 'Exporting...' : 'Export to Sheets'}
            </button>
          </div>

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
