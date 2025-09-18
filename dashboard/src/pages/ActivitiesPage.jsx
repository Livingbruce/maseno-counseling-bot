import React, { useEffect, useState, useContext } from 'react';
import API from '../api';
import { AuthContext } from '../AuthContext';

export default function ActivitiesPage() {
  const { user } = useContext(AuthContext);
  const [activities, setActivities] = useState([]);
  const [form, setForm] = useState({ title:'', description:'', start_ts:'', end_ts:'' });

  useEffect(()=> {
    API.get('/activities').then(r => setActivities(r.data));
  },[]);

  async function create(e) {
    e.preventDefault();
    try {
      const res = await API.post('/activities', form);
      setActivities(prev => [...prev, res.data]);
      setForm({ title:'', description:'', start_ts:'', end_ts:'' });
    } catch(err) {
      alert(err.response?.data?.error || 'Failed');
    }
  }

  return (
    <div>
      <h3>Activities</h3>
      <form onSubmit={create}>
        <input value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} placeholder="Title" required />
        <input type="datetime-local" value={form.start_ts} onChange={e=>setForm(f=>({...f,start_ts:e.target.value}))} required />
        <input type="datetime-local" value={form.end_ts} onChange={e=>setForm(f=>({...f,end_ts:e.target.value}))} />
        <textarea value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} placeholder="Description" />
        <button type="submit">Create</button>
      </form>

      <ul>
        {activities.map(a => (
          <li key={a.id}>
            <b>{a.title}</b> — {new Date(a.start_ts).toLocaleString()} {a.counselor_name ? ` by ${a.counselor_name}` : ''}
          </li>
        ))}
      </ul>
    </div>
  );
}
