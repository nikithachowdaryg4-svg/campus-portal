import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const FacultyDashboard = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/assignments" element={<Assignments />} />
        <Route path="/marks" element={<Marks />} />
        <Route path="/notices" element={<Notices />} />
        <Route path="/events" element={<Events />} />
        <Route path="/free-periods" element={<FreePeriods />} />
      </Routes>
    </div>
  );
};

// ... existing Home, Assignments, Marks, Notices

const Events = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');

  const fetchEvents = async () => {
    const { data } = await axios.get('/api/events', {
      headers: { Authorization: `Bearer ${user.token}` }
    });
    setEvents(data);
  };

  useEffect(() => {
    fetchEvents();
  }, [user.token]);

  const submit = async (e) => {
    e.preventDefault();
    await axios.post('/api/events', 
      { title, description, date, location },
      { headers: { Authorization: `Bearer ${user.token}` } }
    );
    alert('Event Created!');
    fetchEvents();
  };

  return (
    <div>
      <h3>Campus Events</h3>
      <form onSubmit={submit} style={{ marginBottom: '20px' }}>
        <h4>Create New Event</h4>
        <input type="text" placeholder="Event Title" value={title} onChange={e=>setTitle(e.target.value)} required /><br/>
        <textarea placeholder="Description" value={description} onChange={e=>setDescription(e.target.value)} required /><br/>
        <input type="datetime-local" value={date} onChange={e=>setDate(e.target.value)} required /><br/>
        <input type="text" placeholder="Location" value={location} onChange={e=>setLocation(e.target.value)} required /><br/>
        <button type="submit">Create Event</button>
      </form>

      <h4>Upcoming Events</h4>
      {events.map((ev) => (
        <div key={ev._id} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}>
          <h4>{ev.title} - {new Date(ev.date).toLocaleString()}</h4>
          <p>{ev.description}</p>
          <p><strong>Location:</strong> {ev.location}</p>
          <p><strong>Attendees:</strong> {ev.attendees.length} ({ev.attendees.map(a => a.username).join(', ')})</p>
        </div>
      ))}
    </div>
  );
};

const Home = () => <h2>Faculty Dashboard Home</h2>;

const Assignments = () => {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [deadline, setDeadline] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    await axios.post('/api/faculty/assignments', 
      { title, description: desc, deadline },
      { headers: { Authorization: `Bearer ${user.token}` } }
    );
    alert('Assignment Added!');
  };

  return (
    <form onSubmit={submit}>
      <h3>Add Assignment</h3>
      <input type="text" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} required /><br/>
      <textarea placeholder="Description" value={desc} onChange={e=>setDesc(e.target.value)} required /><br/>
      <input type="date" value={deadline} onChange={e=>setDeadline(e.target.value)} required /><br/>
      <button type="submit">Add Assignment</button>
    </form>
  );
};

const Marks = () => {
  const { user } = useAuth();
  const [studentId, setStudentId] = useState('');
  const [subject, setSubject] = useState('');
  const [score, setScore] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/faculty/marks', 
        { studentId, subject, score },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      alert('Marks Assigned!');
      setStudentId('');
      setSubject('');
      setScore('');
    } catch (err) {
      alert(err.response?.data?.message || 'Error assigning marks');
    }
  };

  return (
    <form onSubmit={submit}>
      <h3>Assign Marks</h3>
      <input type="text" placeholder="Student Username" value={studentId} onChange={e=>setStudentId(e.target.value)} required /><br/>
      <input type="text" placeholder="Subject" value={subject} onChange={e=>setSubject(e.target.value)} required /><br/>
      <input type="number" placeholder="Score" value={score} onChange={e=>setScore(e.target.value)} required /><br/>
      <button type="submit">Assign Marks</button>
    </form>
  );
};

const Notices = () => {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    await axios.post('/api/faculty/notices', 
      { title, content },
      { headers: { Authorization: `Bearer ${user.token}` } }
    );
    alert('Notice Posted!');
  };

  return (
    <form onSubmit={submit}>
      <h3>Post Notice</h3>
      <input type="text" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} required /><br/>
      <textarea placeholder="Content" value={content} onChange={e=>setContent(e.target.value)} required /><br/>
      <button type="submit">Post Notice</button>
    </form>
  );
};

const FreePeriods = () => {
  const { user } = useAuth();
  const [statuses, setStatuses] = useState([]);

  useEffect(() => {
    const fetchStatuses = async () => {
      const { data } = await axios.get('/api/faculty/class-statuses', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setStatuses(data);
    };
    fetchStatuses();
  }, [user.token]);

  return (
    <div>
      <h3>Class Statuses & Free Periods</h3>
      {statuses.map(s => (
        <div key={s._id} style={{border: '1px solid black', margin: '10px', padding: '10px'}}>
          <p><strong>Student:</strong> {s.student.username}</p>
          <p><strong>Status:</strong> {s.status}</p>
          <p><strong>Time:</strong> {s.time}</p>
          <p><strong>Feedback:</strong> {s.feedback}</p>
        </div>
      ))}
    </div>
  );
};

export default FacultyDashboard;
