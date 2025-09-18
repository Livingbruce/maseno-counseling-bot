import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../ThemeContext';
import api from '../utils/api';

const Department = () => {
  const { isDarkMode } = useTheme();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [departmentInfo, setDepartmentInfo] = useState({
    department_name: '',
    location: '',
    building: '',
    floor: '',
    room_number: '',
    directions: '',
    landmarks: '',
    parking_info: '',
    accessibility_info: '',
    contact_person: '',
    contact_phone: '',
    operating_hours: '',
    services_offered: ''
  });

  useEffect(() => {
    fetchDepartmentInfo();
  }, []);

  const fetchDepartmentInfo = async () => {
    try {
      const response = await api.get('/department');
      if (response.data.success) {
        setDepartmentInfo(response.data.department);
      }
    } catch (error) {
      console.error('Error fetching department info:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDepartmentInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await api.put('/department', departmentInfo);
      
      if (response.data.success) {
        setMessage('Department information updated successfully!');
      } else {
        setMessage('Failed to update department information. Please try again.');
      }
    } catch (error) {
      console.error('Error updating department info:', error);
      setMessage('Error updating department information. Please try again.');
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

  const textareaStyle = {
    ...inputStyle,
    minHeight: '120px',
    resize: 'vertical'
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
          🏢 Department
        </h1>
      </div>

      {message && (
        <div style={messageStyle}>
          {message}
        </div>
      )}

      <div style={cardStyle}>
        <h2 style={{ color: 'var(--text-primary)', marginBottom: '1.5rem' }}>
          Update Information
        </h2>
        
        <form onSubmit={handleSubmit} style={formStyle}>
          <div>
            <label style={labelStyle} htmlFor="department_name">
              Department Name *
            </label>
            <input
              type="text"
              id="department_name"
              name="department_name"
              value={departmentInfo.department_name}
              onChange={handleChange}
              required
              style={inputStyle}
              placeholder="Student Counseling Department"
            />
          </div>

          <div>
            <label style={labelStyle} htmlFor="location">
              Campus Location *
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={departmentInfo.location}
              onChange={handleChange}
              required
              style={inputStyle}
              placeholder="Main Campus"
            />
          </div>

          <div>
            <label style={labelStyle} htmlFor="building">
              Building Name *
            </label>
            <input
              type="text"
              id="building"
              name="building"
              value={departmentInfo.building}
              onChange={handleChange}
              required
              style={inputStyle}
              placeholder="Administration Building"
            />
          </div>

          <div>
            <label style={labelStyle} htmlFor="floor">
              Floor
            </label>
            <input
              type="text"
              id="floor"
              name="floor"
              value={departmentInfo.floor}
              onChange={handleChange}
              style={inputStyle}
              placeholder="2nd Floor"
            />
          </div>

          <div>
            <label style={labelStyle} htmlFor="room_number">
              Room Number *
            </label>
            <input
              type="text"
              id="room_number"
              name="room_number"
              value={departmentInfo.room_number}
              onChange={handleChange}
              required
              style={inputStyle}
              placeholder="Room 205"
            />
          </div>

          <div>
            <label style={labelStyle} htmlFor="contact_person">
              Contact Person *
            </label>
            <input
              type="text"
              id="contact_person"
              name="contact_person"
              value={departmentInfo.contact_person}
              onChange={handleChange}
              required
              style={inputStyle}
              placeholder="Dr. Jane Smith"
            />
          </div>

          <div>
            <label style={labelStyle} htmlFor="contact_phone">
              Contact Phone *
            </label>
            <input
              type="tel"
              id="contact_phone"
              name="contact_phone"
              value={departmentInfo.contact_phone}
              onChange={handleChange}
              required
              style={inputStyle}
              placeholder="+254-XXX-XXXX"
            />
          </div>

          <div>
            <label style={labelStyle} htmlFor="operating_hours">
              Operating Hours *
            </label>
            <input
              type="text"
              id="operating_hours"
              name="operating_hours"
              value={departmentInfo.operating_hours}
              onChange={handleChange}
              required
              style={inputStyle}
              placeholder="Monday - Friday: 8:00 AM - 5:00 PM"
            />
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle} htmlFor="directions">
              Detailed Directions *
            </label>
            <textarea
              id="directions"
              name="directions"
              value={departmentInfo.directions}
              onChange={handleChange}
              required
              style={textareaStyle}
              placeholder="From the main gate, walk straight for 200m, turn left at the library, continue for 100m, the Administration Building will be on your right. Enter through the main entrance and take the stairs to the 2nd floor. Room 205 is the first door on your left."
            />
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle} htmlFor="landmarks">
              Nearby Landmarks
            </label>
            <textarea
              id="landmarks"
              name="landmarks"
              value={departmentInfo.landmarks}
              onChange={handleChange}
              style={textareaStyle}
              placeholder="Next to the library, opposite the student center, near the main auditorium"
            />
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle} htmlFor="parking_info">
              Parking Information
            </label>
            <textarea
              id="parking_info"
              name="parking_info"
              value={departmentInfo.parking_info}
              onChange={handleChange}
              style={textareaStyle}
              placeholder="Free parking available in front of the Administration Building. Visitor parking is located on the ground floor."
            />
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle} htmlFor="accessibility_info">
              Accessibility Information
            </label>
            <textarea
              id="accessibility_info"
              name="accessibility_info"
              value={departmentInfo.accessibility_info}
              onChange={handleChange}
              style={textareaStyle}
              placeholder="The building is wheelchair accessible. Elevator available. Accessible restrooms on each floor."
            />
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle} htmlFor="services_offered">
              Services Offered
            </label>
            <textarea
              id="services_offered"
              name="services_offered"
              value={departmentInfo.services_offered}
              onChange={handleChange}
              style={textareaStyle}
              placeholder="Academic counseling, career guidance, personal counseling, mental health support, study skills workshops, peer counseling programs"
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
            {loading ? 'Updating...' : 'Update Information'}
          </button>
        </form>
      </div>

      <div style={cardStyle}>
        <h3 style={{ color: 'var(--text-primary)', marginBottom: '1rem' }}>
          Current Information
        </h3>
        <div style={{ display: 'grid', gap: '0.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
          <div>
            <strong style={{ color: 'var(--text-secondary)' }}>Department:</strong>
            <span style={{ color: 'var(--text-primary)', marginLeft: '0.5rem' }}>
              {departmentInfo.department_name || 'Not set'}
            </span>
          </div>
          <div>
            <strong style={{ color: 'var(--text-secondary)' }}>Location:</strong>
            <span style={{ color: 'var(--text-primary)', marginLeft: '0.5rem' }}>
              {departmentInfo.location || 'Not set'}
            </span>
          </div>
          <div>
            <strong style={{ color: 'var(--text-secondary)' }}>Building:</strong>
            <span style={{ color: 'var(--text-primary)', marginLeft: '0.5rem' }}>
              {departmentInfo.building || 'Not set'}
            </span>
          </div>
          <div>
            <strong style={{ color: 'var(--text-secondary)' }}>Room:</strong>
            <span style={{ color: 'var(--text-primary)', marginLeft: '0.5rem' }}>
              {departmentInfo.room_number || 'Not set'}
            </span>
          </div>
          <div>
            <strong style={{ color: 'var(--text-secondary)' }}>Contact Person:</strong>
            <span style={{ color: 'var(--text-primary)', marginLeft: '0.5rem' }}>
              {departmentInfo.contact_person || 'Not set'}
            </span>
          </div>
          <div>
            <strong style={{ color: 'var(--text-secondary)' }}>Phone:</strong>
            <span style={{ color: 'var(--text-primary)', marginLeft: '0.5rem' }}>
              {departmentInfo.contact_phone || 'Not set'}
            </span>
          </div>
        </div>
        
        {departmentInfo.directions && (
          <div style={{ marginTop: '1rem' }}>
            <strong style={{ color: 'var(--text-secondary)' }}>Directions:</strong>
            <p style={{ color: 'var(--text-primary)', marginTop: '0.5rem', whiteSpace: 'pre-line' }}>
              {departmentInfo.directions}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Department;
