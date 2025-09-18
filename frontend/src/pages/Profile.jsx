import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import { useTheme } from '../ThemeContext';
import api from '../utils/api';

const Profile = () => {
  const { user, setUser } = useContext(AuthContext);
  const { isDarkMode } = useTheme();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    specialization: '',
    bio: '',
    office_location: '',
    office_hours: ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        specialization: user.specialization || '',
        bio: user.bio || '',
        office_location: user.office_location || '',
        office_hours: user.office_hours || ''
      });
    }
  }, [user]);

  // Auto-dismiss success messages after 5 seconds
  useEffect(() => {
    if (message && message.includes('successfully')) {
      const timer = setTimeout(() => {
        setMessage('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  useEffect(() => {
    if (passwordMessage && passwordMessage.includes('successfully')) {
      const timer = setTimeout(() => {
        setPasswordMessage('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [passwordMessage]);

  // Dismiss message handlers
  const dismissMessage = () => {
    setMessage('');
  };

  const dismissPasswordMessage = () => {
    setPasswordMessage('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear success message when user starts typing
    if (message && message.includes('successfully')) {
      setMessage('');
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear success message when user starts typing
    if (passwordMessage && passwordMessage.includes('successfully')) {
      setPasswordMessage('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      console.log('Sending profile update:', formData);
      const response = await api.put('/auth/profile', formData);
      console.log('Profile update response:', response);
      
      if (response.success) {
        setMessage('Profile updated successfully!');
        // Update the user context with new data from the response
        setUser(prev => ({
          ...prev,
          ...response.counselor
        }));
        
        // Also update localStorage to persist the changes
        const updatedUser = { ...user, ...response.counselor };
        localStorage.setItem("user", JSON.stringify(updatedUser));
      } else {
        setMessage('Failed to update profile. Please try again.');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Error updating profile. Please try again.';
      setMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordLoading(true);
    setPasswordMessage('');

    // Validate passwords
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordMessage('New passwords do not match.');
      setPasswordLoading(false);
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordMessage('New password must be at least 6 characters long.');
      setPasswordLoading(false);
      return;
    }

    try {
      const response = await api.put('/auth/password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      if (response.success) {
        setPasswordMessage('Password updated successfully!');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        setPasswordMessage(response.message || 'Failed to update password. Please check your current password.');
      }
    } catch (error) {
      console.error('Error updating password:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Error updating password. Please try again.';
      setPasswordMessage(errorMessage);
    } finally {
      setPasswordLoading(false);
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
    color: message.includes('successfully') ? 'var(--alert-success-text)' : 'var(--alert-danger-text)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative'
  };

  const closeButtonStyle = {
    background: 'none',
    border: 'none',
    color: 'inherit',
    fontSize: '1.2rem',
    cursor: 'pointer',
    padding: '0',
    marginLeft: '1rem',
    opacity: '0.7',
    transition: 'opacity 0.2s',
    lineHeight: '1'
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <button style={{
            ...buttonStyle,
            backgroundColor: 'var(--btn-secondary)',
            marginBottom: '1rem'
          }}>
            ← Back to Dashboard
          </button>
        </Link>
        <h1 style={{ color: 'var(--text-primary)', margin: '0' }}>
          ⚙️ Profile Settings
        </h1>
      </div>

      {message && (
        <div style={messageStyle}>
          <span>{message}</span>
          <button 
            style={closeButtonStyle}
            onClick={dismissMessage}
            onMouseEnter={(e) => e.target.style.opacity = '1'}
            onMouseLeave={(e) => e.target.style.opacity = '0.7'}
            title="Dismiss message"
          >
            ×
          </button>
        </div>
      )}

      <div style={cardStyle}>
        <h2 style={{ color: 'var(--text-primary)', marginBottom: '1.5rem' }}>
          Update Your Profile Information
        </h2>
        
        <form onSubmit={handleSubmit} style={formStyle}>
          <div>
            <label style={labelStyle} htmlFor="name">
              Full Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              style={inputStyle}
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label style={labelStyle} htmlFor="email">
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={inputStyle}
              placeholder="Enter your email address"
            />
          </div>

          <div>
            <label style={labelStyle} htmlFor="phone">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              style={inputStyle}
              placeholder="Enter your phone number"
            />
          </div>

          <div>
            <label style={labelStyle} htmlFor="specialization">
              Specialization
            </label>
            <input
              type="text"
              id="specialization"
              name="specialization"
              value={formData.specialization}
              onChange={handleChange}
              style={inputStyle}
              placeholder="e.g., Academic Counseling, Career Guidance"
            />
          </div>

          <div>
            <label style={labelStyle} htmlFor="office_location">
              Office Location
            </label>
            <input
              type="text"
              id="office_location"
              name="office_location"
              value={formData.office_location}
              onChange={handleChange}
              style={inputStyle}
              placeholder="e.g., Main Campus, Room 205"
            />
          </div>

          <div>
            <label style={labelStyle} htmlFor="office_hours">
              Office Hours
            </label>
            <input
              type="text"
              id="office_hours"
              name="office_hours"
              value={formData.office_hours}
              onChange={handleChange}
              style={inputStyle}
              placeholder="e.g., Monday-Friday 8:00 AM - 5:00 PM"
            />
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle} htmlFor="bio">
              Bio/Description
            </label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              style={{
                ...inputStyle,
                minHeight: '120px',
                resize: 'vertical'
              }}
              placeholder="Tell students about yourself and your counseling approach..."
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
            {loading ? 'Updating...' : 'Update Profile'}
          </button>
        </form>
      </div>

      <div style={cardStyle}>
        <h3 style={{ color: 'var(--text-primary)', marginBottom: '1rem' }}>
          Current Profile Information
        </h3>
        <div style={{ display: 'grid', gap: '0.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
          <div>
            <strong style={{ color: 'var(--text-secondary)' }}>Name:</strong>
            <span style={{ color: 'var(--text-primary)', marginLeft: '0.5rem' }}>
              {user?.name || 'Not set'}
            </span>
          </div>
          <div>
            <strong style={{ color: 'var(--text-secondary)' }}>Email:</strong>
            <span style={{ color: 'var(--text-primary)', marginLeft: '0.5rem' }}>
              {user?.email || 'Not set'}
            </span>
          </div>
          <div>
            <strong style={{ color: 'var(--text-secondary)' }}>Phone:</strong>
            <span style={{ color: 'var(--text-primary)', marginLeft: '0.5rem' }}>
              {user?.phone || 'Not set'}
            </span>
          </div>
          <div>
            <strong style={{ color: 'var(--text-secondary)' }}>Specialization:</strong>
            <span style={{ color: 'var(--text-primary)', marginLeft: '0.5rem' }}>
              {user?.specialization || 'Not set'}
            </span>
          </div>
        </div>
      </div>

      <div style={cardStyle}>
        <h2 style={{ color: 'var(--text-primary)', marginBottom: '1.5rem' }}>
          🔒 Change Password
        </h2>
        
        {passwordMessage && (
          <div style={{
            ...messageStyle,
            backgroundColor: passwordMessage.includes('successfully') ? 'var(--alert-success)' : 'var(--alert-danger)',
            color: passwordMessage.includes('successfully') ? 'var(--alert-success-text)' : 'var(--alert-danger-text)'
          }}>
            <span>{passwordMessage}</span>
            <button 
              style={closeButtonStyle}
              onClick={dismissPasswordMessage}
              onMouseEnter={(e) => e.target.style.opacity = '1'}
              onMouseLeave={(e) => e.target.style.opacity = '0.7'}
              title="Dismiss message"
            >
              ×
            </button>
          </div>
        )}

        <form onSubmit={handlePasswordSubmit} style={formStyle}>
          <div>
            <label style={labelStyle} htmlFor="currentPassword">
              Current Password *
            </label>
            <input
              type="password"
              id="currentPassword"
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              required
              style={inputStyle}
              placeholder="Enter your current password"
            />
          </div>

          <div>
            <label style={labelStyle} htmlFor="newPassword">
              New Password *
            </label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              required
              style={inputStyle}
              placeholder="Enter your new password (min 6 characters)"
            />
          </div>

          <div>
            <label style={labelStyle} htmlFor="confirmPassword">
              Confirm New Password *
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              required
              style={inputStyle}
              placeholder="Confirm your new password"
            />
          </div>

          <button
            type="submit"
            disabled={passwordLoading}
            style={{
              ...buttonStyle,
              backgroundColor: 'var(--btn-warning)',
              opacity: passwordLoading ? 0.7 : 1,
              cursor: passwordLoading ? 'not-allowed' : 'pointer'
            }}
          >
            {passwordLoading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
