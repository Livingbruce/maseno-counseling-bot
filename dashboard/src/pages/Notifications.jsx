import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../ThemeContext';
import api from '../utils/api';

const Notifications = () => {
  const { isDarkMode } = useTheme();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [newNotification, setNewNotification] = useState({
    title: '',
    message: '',
    priority: 'normal',
    target_counselor: 'all'
  });

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await api.get('/notifications/counselor');
      if (response.data.success) {
        setNotifications(response.data.notifications);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewNotification(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newNotification.title.trim() || !newNotification.message.trim()) return;

    setLoading(true);
    setMessage('');

    try {
      const response = await api.post('/notifications/counselor', newNotification);
      
      if (response.data.success) {
        setMessage('Notification sent!');
        setNewNotification({
          title: '',
          message: '',
          priority: 'normal',
          target_counselor: 'all'
        });
        fetchNotifications();
      } else {
        setMessage('Failed to send notification. Please try again.');
      }
    } catch (error) {
      console.error('Error sending notification:', error);
      setMessage('Error sending notification. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      fetchNotifications();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const deleteNotification = async (id) => {
    if (!window.confirm('Delete this notification?')) return;
    
    try {
      await api.delete(`/notifications/${id}`);
      setMessage('Notification deleted successfully!');
      fetchNotifications();
    } catch (error) {
      console.error('Error deleting notification:', error);
      setMessage('Error deleting notification. Please try again.');
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'var(--alert-danger)';
      case 'high': return 'var(--alert-warning)';
      case 'normal': return 'var(--alert-info)';
      case 'low': return 'var(--text-muted)';
      default: return 'var(--text-secondary)';
    }
  };

  const getPriorityTextColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'var(--alert-danger-text)';
      case 'high': return 'var(--alert-warning-text)';
      case 'normal': return 'var(--alert-info-text)';
      case 'low': return 'var(--text-primary)';
      default: return 'var(--text-primary)';
    }
  };

  const cardStyle = {
    backgroundColor: 'var(--card-bg)',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    padding: '1.5rem',
    boxShadow: 'var(--shadow)',
    marginBottom: '1rem'
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
    minHeight: '100px',
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
    padding: '0.75rem 1.5rem',
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
          🔔 Notifications
        </h1>
      </div>

      {message && (
        <div style={messageStyle}>
          {message}
        </div>
      )}

      <div style={cardStyle}>
        <h2 style={{ color: 'var(--text-primary)', marginBottom: '1.5rem' }}>
          Send Internal Notification
        </h2>
        
        <form onSubmit={handleSubmit} style={formStyle}>
          <div>
            <label style={labelStyle} htmlFor="title">
              Notification Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={newNotification.title}
              onChange={handleChange}
              required
              style={inputStyle}
              placeholder="Enter notification title"
            />
          </div>

          <div>
            <label style={labelStyle} htmlFor="priority">
              Priority Level *
            </label>
            <select
              id="priority"
              name="priority"
              value={newNotification.priority}
              onChange={handleChange}
              required
              style={inputStyle}
            >
              <option value="low">Low</option>
              <option value="normal">Normal</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>

          <div>
            <label style={labelStyle} htmlFor="target_counselor">
              Target Counselor
            </label>
            <select
              id="target_counselor"
              name="target_counselor"
              value={newNotification.target_counselor}
              onChange={handleChange}
              style={inputStyle}
            >
              <option value="all">All Counselors</option>
              <option value="admin">Admin Only</option>
              <option value="senior">Senior Counselors</option>
            </select>
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle} htmlFor="message">
              Message *
            </label>
            <textarea
              id="message"
              name="message"
              value={newNotification.message}
              onChange={handleChange}
              required
              style={textareaStyle}
              placeholder="Enter notification message..."
            />
          </div>

          <button
            type="submit"
            disabled={loading || !newNotification.title.trim() || !newNotification.message.trim()}
            style={{
              ...buttonStyle,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Sending...' : 'Send Notification'}
          </button>
        </form>
      </div>

      <div style={cardStyle}>
        <h3 style={{ color: 'var(--text-primary)', marginBottom: '1rem' }}>
          Recent Notifications ({notifications.length})
        </h3>

        {notifications.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem' }}>
            No notifications found.
          </p>
        ) : (
          notifications.map(notification => (
            <div key={notification.id} style={{
              ...cardStyle,
              backgroundColor: notification.is_read ? 'var(--bg-secondary)' : 'var(--card-bg)',
              borderLeft: `4px solid ${getPriorityColor(notification.priority)}`,
              marginBottom: '1rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                  <h4 style={{ 
                    color: 'var(--text-primary)', 
                    margin: '0 0 0.5rem 0',
                    fontWeight: notification.is_read ? '400' : '600'
                  }}>
                    {notification.title}
                  </h4>
                  <p style={{ color: 'var(--text-secondary)', margin: '0 0 0.5rem 0', fontSize: '0.9rem' }}>
                    From: {notification.sender_name || 'System'} • {new Date(notification.created_at).toLocaleString()}
                  </p>
                  <p style={{ color: 'var(--text-primary)', margin: '0 0 0.5rem 0', whiteSpace: 'pre-wrap' }}>
                    {notification.message}
                  </p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                  <span style={{
                    backgroundColor: getPriorityColor(notification.priority),
                    color: getPriorityTextColor(notification.priority),
                    padding: '0.25rem 0.75rem',
                    borderRadius: '12px',
                    fontSize: '0.8rem',
                    fontWeight: '500',
                    textTransform: 'uppercase'
                  }}>
                    {notification.priority}
                  </span>
                  {!notification.is_read && (
                    <span style={{
                      backgroundColor: 'var(--btn-primary)',
                      color: 'white',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '4px',
                      fontSize: '0.7rem',
                      fontWeight: '500'
                    }}>
                      NEW
                    </span>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {!notification.is_read && (
                  <button
                    onClick={() => markAsRead(notification.id)}
                    style={{
                      backgroundColor: 'var(--btn-success)',
                      color: 'white',
                      border: 'none',
                      padding: '0.5rem 1rem',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '0.9rem'
                    }}
                  >
                    Mark as Read
                  </button>
                )}
                
                <button
                  onClick={() => deleteNotification(notification.id)}
                  style={{
                    backgroundColor: 'var(--btn-danger)',
                    color: 'white',
                    border: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.9rem'
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;
