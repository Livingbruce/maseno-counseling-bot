import React, { useEffect, useState } from 'react';
import API from '../api';

export default function BooksPage() {
  const [books, setBooks] = useState([]);
  const [form, setForm] = useState({ title:'', description:'', price_cents:0, payment_method:'', pickup_station:'' });

  useEffect(()=> {
    API.get('/books').then(r => setBooks(r.data));
  },[]);

  async function create(e) {
    e.preventDefault();
    try {
      const res = await API.post('/books', form);
      setBooks(prev => [res.data, ...prev]);
      setForm({ title:'', description:'', price_cents:0, payment_method:'', pickup_station:'' });
    } catch(err) {
      alert(err.response?.data?.error || 'Failed');
    }
  }

  return (
    <div>
      <h3>Books</h3>
      <form onSubmit={create}>
        <input value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} placeholder="Title" required />
        <input type="number" value={form.price_cents} onChange={e=>setForm(f=>({...f,price_cents:parseInt(e.target.value||0)}))} required />
        <input value={form.payment_method} onChange={e=>setForm(f=>({...f,payment_method:e.target.value}))} placeholder="MPESA / Bank" />
        <input value={form.pickup_station} onChange={e=>setForm(f=>({...f,pickup_station:e.target.value}))} placeholder="Pickup station" />
        <button type="submit">Add Book</button>
      </form>

      <ul>
        {books.map(b => (
          <li key={b.id}>{b.title} — Ksh {(b.price_cents/100).toFixed(2)} {b.payment_method ? ` (${b.payment_method})` : ''}</li>
        ))}
      </ul>
    </div>
  );
}
