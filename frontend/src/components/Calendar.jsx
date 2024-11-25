import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import NavBar from '../navbar';
import Sidebar from '../sidebar';

function Calendar() {
  const [appointments, setAppointments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    // Load Google API script
    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/api.js';
    script.onload = () => {
      fetchAllEvents();
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const fetchAllEvents = async () => {
    try {
      // First fetch database events as they don't require authentication
      const dbEvents = await fetchDatabaseEvents();
      
      let allEvents = [...dbEvents];
      
      // Only try to fetch Google events if gapi is available
      if (window.gapi) {
        const googleEvents = await fetchGoogleEvents();
        if (googleEvents) {
          allEvents = [...allEvents, ...googleEvents];
        }
      }
      
      setAppointments(allEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const fetchDatabaseEvents = async () => {
    try {
      const response = await fetch('http://localhost:3001/appointments');
      const data = await response.json();
      
      return data.map(event => {
        try {
          // Handle date and time parsing more safely
          const [year, month, day] = event.date.split('-').map(num => parseInt(num, 10));
          const [hours, minutes] = event.time.split(':').map(num => parseInt(num, 10));
          
          // Create date strings in ISO format
          const startDateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}T${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`;
          const endDateStr = new Date(new Date(startDateStr).getTime() + 60 * 60 * 1000).toISOString();

          return {
            title: `${event.appType} - ${event.purpose}`,
            start: startDateStr,
            end: endDateStr,
            status: event.status,
            backgroundColor: event.status === 'Confirmed' ? '#14a44d' : '#FFB703',
            source: 'database',
            extendedProps: {
              userName: event.userName,
              department: event.department,
              status: event.status
            }
          };
        } catch (parseError) {
          console.error('Error parsing date/time for event:', event, parseError);
          return null;
        }
      }).filter(event => event !== null); // Remove any events that failed to parse

    } catch (error) {
      console.error('Error fetching database events:', error);
      return [];
    }
  };

  const fetchGoogleEvents = async () => {
    try {
      return new Promise((resolve, reject) => {
        window.gapi.load('client:auth2', async () => {
          try {
            await window.gapi.client.init({
              apiKey: 'AIzaSyAK7FUjiLlDqPmDPFY86htLv6THAsnJJTY',
              clientId: '280952324230-nb8i95vcvkosdhsaoub1j8il95o2kjp5.apps.googleusercontent.com',
              scope: 'https://www.googleapis.com/auth/calendar.readonly',
              discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
            });

            // Check if we're running on an authorized origin
            const currentOrigin = window.location.origin;
            console.log('Current origin:', currentOrigin);

            const authInstance = window.gapi.auth2.getAuthInstance();
            if (!authInstance.isSignedIn.get()) {
              await authInstance.signIn();
            }

            const accessToken = authInstance.currentUser.get().getAuthResponse().access_token;
            const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            });
            
            if (!response.ok) {
              throw new Error('Failed to fetch Google Calendar events');
            }
            
            const data = await response.json();
            const events = data.items.map(event => ({
              title: event.summary,
              start: event.start.dateTime || event.start.date,
              end: event.end.dateTime || event.end.date,
              status: event.status || 'Confirmed',
              backgroundColor: event.status === 'confirmed' ? '#14a44d' : '#FFB703',
              source: 'google'
            }));
            
            resolve(events);
          } catch (error) {
            console.error('Google Calendar initialization error:', error);
            resolve([]); // Return empty array instead of rejecting
          }
        });
      });
    } catch (error) {
      console.error('Error fetching Google events:', error);
      return [];
    }
  };

  const eventContent = (eventInfo) => {
    const isConfirmed = eventInfo.event.extendedProps.status === 'Confirmed';
    return (
      <div className="event-content" style={{
        padding: '1px 3px',
        backgroundColor: isConfirmed ? '#14a44d' : '#FFB703',
        borderRadius: '2px',
        color: '#fff',
        minHeight: '20px',
        maxHeight: '35px',
      }}>
        <div style={{
          fontWeight: '500',
          fontSize: '0.7em',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          lineHeight: '1.1'
        }}>
          {eventInfo.event.title}
        </div>
        <div style={{
          fontSize: '0.65em',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
          {eventInfo.event.extendedProps.userName}
        </div>
      </div>
    );
  };

  const handleEventClick = (eventInfo) => {
    setSelectedEvent(eventInfo.event);
    setShowModal(true);
  };

  const EventModal = ({ event, onClose }) => {
    if (!event) return null;

    return (
      <div className="modal" style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          width: '400px',
          maxWidth: '90%'
        }}>
          <h2 style={{ marginBottom: '15px' }}>{event.title}</h2>
          <div style={{ marginBottom: '10px' }}>
            <strong>Date:</strong> {new Date(event.start).toLocaleDateString()}
          </div>
          <div style={{ marginBottom: '10px' }}>
            <strong>Time:</strong> {new Date(event.start).toLocaleTimeString()}
          </div>
          <div style={{ marginBottom: '10px' }}>
            <strong>Status:</strong> {event.extendedProps.status}
          </div>
          <div style={{ marginBottom: '10px' }}>
            <strong>Student:</strong> {event.extendedProps.userName}
          </div>
          <div style={{ marginBottom: '20px' }}>
            <strong>Department:</strong> {event.extendedProps.department}
          </div>
          <button 
            onClick={onClose}
            style={{
              backgroundColor: '#FFB703',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Close
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      <NavBar />
      <div className="card1">
        <Sidebar />
        <div className="card3">
          <div style={{ padding: '20px', height: '70vh' }}>
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay',
              }}
              events={appointments}
              eventContent={eventContent}
              height="auto"
              eventDisplay="block"
              dayMaxEvents={4}
              eventTimeFormat={{
                hour: '2-digit',
                minute: '2-digit',
                meridiem: false
              }}
              slotMinTime="08:00:00"
              slotMaxTime="17:00:00"
              slotDuration="01:00:00"
              allDaySlot={false}
              dayMaxEventRows={4}
              eventMaxStack={3}
              aspectRatio={1.5}
              eventClick={handleEventClick}
            />
          </div>
        </div>
      </div>
      {showModal && (
        <EventModal 
          event={selectedEvent} 
          onClose={() => setShowModal(false)} 
        />
      )}
    </>
  );
}

export default Calendar; 