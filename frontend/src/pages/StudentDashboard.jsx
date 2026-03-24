import React, { useState, useEffect, useMemo, useTransition } from 'react';
import { Routes, Route } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

const StudentDashboard = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/assignments" element={<Assignments />} />
        <Route path="/marks" element={<Marks />} />
        <Route path="/notices" element={<Notices />} />
        <Route path="/events" element={<Events />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/class-status" element={<ClassStatus />} />
      </Routes>
    </div>
  );
};

// ... existing Home, Assignments, Marks, Notices

const Events = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);

  const fetchEvents = async () => {
    const { data } = await axios.get('/api/events', {
      headers: { Authorization: `Bearer ${user.token}` }
    });
    setEvents(data);
  };

  useEffect(() => {
    fetchEvents();
  }, [user.token]);

  const toggleRsvp = async (id) => {
    await axios.put(`/api/events/${id}/rsvp`, {}, {
      headers: { Authorization: `Bearer ${user.token}` }
    });
    fetchEvents();
  };

  return (
    <div>
      <h3>Campus Events</h3>
      {events.map((ev) => {
        const isAttending = ev.attendees.some(a => a._id === user._id || a === user._id || a.username === user.username);
        return (
          <div key={ev._id} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0', backgroundColor: isAttending ? '#e6ffe6' : 'white' }}>
            <h4>{ev.title} - {new Date(ev.date).toLocaleString()}</h4>
            <p>{ev.description}</p>
            <p><strong>Location:</strong> {ev.location}</p>
            <p><strong>By:</strong> {ev.createdBy?.username}</p>
            <button onClick={() => toggleRsvp(ev._id)}>
              {isAttending ? 'Cancel RSVP' : 'RSVP'}
            </button>
          </div>
        );
      })}
    </div>
  );
};

const Home = () => <h2>Student Dashboard Home</h2>;

const Assignments = () => {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [submission, setSubmission] = useState({});
  const [search, setSearch] = useState('');
  const [filterText, setFilterText] = useState('');
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const fetchAssignments = async () => {
      const { data } = await axios.get('/api/student/assignments', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setAssignments(data);
    };
    fetchAssignments();
  }, [user.token]);

  const submitAssignment = async (id) => {
    try {
      await axios.post(`/api/student/assignments/${id}/submit`,
        { content: submission[id] },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      alert('Submitted successfully!');
    } catch (e) {
      alert(e.response?.data?.message || 'Error occurred');
    }
  };

  const filteredAssignments = assignments.filter(a => 
    a.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h3>Assignments</h3>
      <input 
        type="text" 
        placeholder="Search assignments..." 
        value={filterText} 
        onChange={(e) => {
          const val = e.target.value;
          setFilterText(val);
          startTransition(() => {
            setSearch(val);
          });
        }} 
        style={{ marginBottom: '10px', padding: '5px' }}
      />
      {isPending && <p style={{color: 'blue'}}>Filtering...</p>}
      {filteredAssignments.map(a => (
        <div key={a._id} style={{border: '1px solid gray', margin: '10px', padding: '10px'}}>
          <h4>{a.title} ({new Date(a.deadline).toLocaleDateString()})</h4>
          <p>{a.description}</p>
          <p>By: {a.faculty?.username}</p>
          <textarea 
            placeholder="Your submission..." 
            onChange={(e) => setSubmission({...submission, [a._id]: e.target.value})}
          />
          <button onClick={() => submitAssignment(a._id)}>Submit</button>
        </div>
      ))}
    </div>
  );
};

const Marks = () => {
  const { user } = useAuth();
  const [marks, setMarks] = useState([]);

  useEffect(() => {
    const fetchMarks = async () => {
      const { data } = await axios.get('/api/student/marks', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setMarks(data);
    };
    fetchMarks();
  }, [user.token]);

  // Use useMemo as requested by user
  const sortedMarks = useMemo(() => {
    return [...marks].sort((a, b) => b.score - a.score);
  }, [marks]);

  return (
    <div style={{ width: '100%' }}>
      <h3>Your Marks (Sorted by Score)</h3>
      
      {sortedMarks.length > 0 && (
        <div style={{ width: '100%', height: 300, marginTop: '20px', marginBottom: '30px' }}>
          <h4>Performance Chart Visualization</h4>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sortedMarks}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="subject" />
              <YAxis dataKey="score" domain={[0, 100]} />
              <Tooltip />
              <Bar dataKey="score" fill="#8B4513" name="Score" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {sortedMarks.map(m => (
        <div key={m._id} style={{border: '1px outset #ccc', padding: '10px', margin: '10px 0'}}>
          <p><strong>Subject:</strong> {m.subject}</p>
          <p><strong>Score:</strong> {m.score} / {m.total}</p>
          <p><strong>Faculty:</strong> {m.faculty?.username}</p>
        </div>
      ))}
    </div>
  );
};

const Notices = () => {
  const { user } = useAuth();
  const [notices, setNotices] = useState([]);

  useEffect(() => {
    const fetchNotices = async () => {
      const { data } = await axios.get('/api/student/notices', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setNotices(data);
    };
    fetchNotices();
  }, [user.token]);

  return (
    <div>
      <h3>Notice Board</h3>
      {notices.map(n => (
        <div key={n._id} style={{backgroundColor: '#ffffe0', border: '1px solid #e0e000', padding:'10px', marginBottom: '10px'}}>
          <h4>{n.title}</h4>
          <p>{n.content}</p>
          <small>Posted by: {n.faculty?.username}</small>
        </div>
      ))}
    </div>
  );
};

// Feedback page: Displays faculty's name and feedback
const Feedback = () => {
  return (
    <div>
      <h3>Feedback Page</h3>
      <p>Here you will see faculty feedback. Notice: This feature is simulated or viewable via class statuses.</p>
    </div>
  );
};

const ClassStatus = () => {
  const { user } = useAuth();
  const [faculties, setFaculties] = useState([]);
  const [facultyName, setFacultyName] = useState('');
  const [status, setStatus] = useState('happening');
  const [time, setTime] = useState('');
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    const fetchFaculties = async () => {
      const { data } = await axios.get('/api/student/faculties', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setFaculties(data);
      if(data.length > 0) setFacultyName(data[0].username);
    };
    fetchFaculties();
  }, [user.token]);

  const submit = async (e) => {
    e.preventDefault();
    await axios.post('/api/student/class-status', 
      { facultyName, status, time, feedback },
      { headers: { Authorization: `Bearer ${user.token}` } }
    );
    alert('Class status and feedback marked!');
  };

  return (
    <form onSubmit={submit} style={{display:'flex', flexDirection:'column', width:'300px', gap:'10px'}}>
      <h3>Mark Class Setup</h3>
      <label>Faculty</label>
      <select value={facultyName} onChange={e=>setFacultyName(e.target.value)}>
        {faculties.map(f => (
          <option key={f._id} value={f.username}>{f.username}</option>
        ))}
      </select>
      
      <label>Status</label>
      <select value={status} onChange={e=>setStatus(e.target.value)}>
        <option value="happening">Happening</option>
        <option value="free">Free Period</option>
      </select>

      <label>Time</label>
      <input type="text" placeholder="e.g. 10:00 AM" value={time} onChange={e=>setTime(e.target.value)} required />

      <label>Feedback for Faculty</label>
      <input type="text" placeholder="Your feedback..." value={feedback} onChange={e=>setFeedback(e.target.value)} />

      <button type="submit">Submit Notification</button>
    </form>
  );
};

export default StudentDashboard;
