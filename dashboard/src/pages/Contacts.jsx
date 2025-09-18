import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../ThemeContext';
import api from '../utils/api';

const Contacts = () => {
  const { isDarkMode } = useTheme();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [contacts, setContacts] = useState({
    office_phone: '',
    email: '',
    office_location: '',
    website: '',
    facebook: '',
    twitter: '',
    instagram: '',
    office_hours: ''
  });

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await api.get('/contacts');
      if (response.data.success) {
        setContacts(response.data.contacts);
      }
    } catch (error) {
      console.error('Error fetching contacts:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContacts(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await api.put('/contacts', contacts);
      
      if (response.data.success) {
        setMessage('Contact information updated successfully!');
      } else {
        setMessage('Failed to update contact information. Please try again.');
      }
    } catch (error) {
      console.error('Error updating contacts:', error);
      setMessage('Error updating contact information. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const cardStyle = {
    backgroundColor: 'var(--card-bg)',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    padding: '2rem',
    boxShadow: 'var(--shadow)',
    marginBottom: '2rem'
  };

  const formStyle = {
    display: 'grid',
    gap: '1rem',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))'
  };

  const inputStyle = {
    padding: '0.75rem',
    border: '1px solid var(--input-border)',
    borderRadius: '4px',
    backgroundColor: 'var(--input-bg)',
    color: 'var(--text-primary)',
    fontSize: '1rem',
    width: '100%',
    boxSizing: 'border-box'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: '500',
    color: 'var(--text-primary)'
  };

  const buttonStyle = {
    backgroundColor: 'var(--btn-primary)',
    color: 'white',
    border: 'none',
    padding: '0.75rem 2rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '500',
    gridColumn: '1 / -1',
    justifySelf: 'start'
  };

  const messageStyle = {
    padding: '1rem',
    borderRadius: '4px',
    marginBottom: '1rem',
    backgroundColor: message.includes('successfully') ? 'var(--alert-success)' : 'var(--alert-danger)',
    color: message.includes('successfully') ? 'var(--alert-success-text)' : 'var(--alert-danger-text)'
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <button style={{
            backgroundColor: 'var(--btn-secondary)',
            color: 'white',
            border: 'none',
            padding: '0.75rem 2rem',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '1rem',
            marginBottom: '1rem'
          }}>
            ← Back to Dashboard
          </button>
        </Link>
        <h1 style={{ color: 'var(--text-primary)', margin: '0' }}>
          📞 Contacts
        </h1>
      </div>

      {message && (
        <div style={messageStyle}>
          {message}
        </div>
      )}

      <div style={cardStyle}>
        <h2 style={{ color: 'var(--text-primary)', marginBottom: '1.5rem' }}>
          Update Contact Information
        </h2>
        
        <form onSubmit={handleSubmit} style={formStyle}>
          <div>
            <label style={labelStyle} htmlFor="office_phone">
              Office Phone *
            </label>
            <input
              type="tel"
              id="office_phone"
              name="office_phone"
              value={contacts.office_phone}
              onChange={handleChange}
              required
              style={inputStyle}
              placeholder="+254-XXX-XXXX"
            />
          </div>


          <div>
            <label style={labelStyle} htmlFor="email">
              General Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={contacts.email}
              onChange={handleChange}
              required
              style={inputStyle}
              placeholder="counseling@maseno.ac.ke"
            />
          </div>


          <div>
            <label style={labelStyle} htmlFor="office_location">
              Office Location *
            </label>
            <input
              type="text"
              id="office_location"
              name="office_location"
              value={contacts.office_location}
              onChange={handleChange}
              required
              style={inputStyle}
              placeholder="Main Campus, Administration Building"
            />
          </div>

          <div>
            <label style={labelStyle} htmlFor="website">
              Website
            </label>
            <input
              type="url"
              id="website"
              name="website"
              value={contacts.website}
              onChange={handleChange}
              style={inputStyle}
              placeholder="www.maseno.ac.ke/counseling"
            />
          </div>

          <div>
            <label style={labelStyle} htmlFor="office_hours">
              Office Hours *
            </label>
            <input
              type="text"
              id="office_hours"
              name="office_hours"
              value={contacts.office_hours}
              onChange={handleChange}
              required
              style={inputStyle}
              placeholder="Monday - Friday: 8:00 AM - 5:00 PM"
            />
          </div>


          <div>
            <label style={labelStyle} htmlFor="facebook">
              Facebook Page
            </label>
            <input
              type="url"
              id="facebook"
              name="facebook"
              value={contacts.facebook}
              onChange={handleChange}
              style={inputStyle}
              placeholder="https://facebook.com/MasenoCounseling"
            />
          </div>

          <div>
            <label style={labelStyle} htmlFor="twitter">
              Twitter Handle
            </label>
            <input
              type="text"
              id="twitter"
              name="twitter"
              value={contacts.twitter}
              onChange={handleChange}
              style={inputStyle}
              placeholder="@MasenoCounseling"
            />
          </div>

          <div>
            <label style={labelStyle} htmlFor="instagram">
              Instagram Handle
            </label>
            <input
              type="text"
              id="instagram"
              name="instagram"
              value={contacts.instagram}
              onChange={handleChange}
              style={inputStyle}
              placeholder="@maseno_counseling"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              ...buttonStyle,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Updating...' : 'Update Contact Information'}
          </button>
        </form>
      </div>

      <div style={cardStyle}>
        <h3 style={{ color: 'var(--text-primary)', marginBottom: '1rem' }}>
          Current Contact Information
        </h3>
        <div style={{ display: 'grid', gap: '0.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
          <div>
            <strong style={{ color: 'var(--text-secondary)' }}>Office Phone:</strong>
            <span style={{ color: 'var(--text-primary)', marginLeft: '0.5rem' }}>
              {contacts.office_phone || 'Not set'}
            </span>
          </div>
          <div>
            <strong style={{ color: 'var(--text-secondary)' }}>Email:</strong>
            <span style={{ color: 'var(--text-primary)', marginLeft: '0.5rem' }}>
              {contacts.email || 'Not set'}
            </span>
          </div>
          <div>
            <strong style={{ color: 'var(--text-secondary)' }}>Office Location:</strong>
            <span style={{ color: 'var(--text-primary)', marginLeft: '0.5rem' }}>
              {contacts.office_location || 'Not set'}
            </span>
          </div>
          <div>
            <strong style={{ color: 'var(--text-secondary)' }}>Website:</strong>
            <span style={{ color: 'var(--text-primary)', marginLeft: '0.5rem' }}>
              {contacts.website || 'Not set'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contacts;
