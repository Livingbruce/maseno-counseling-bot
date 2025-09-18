import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../ThemeContext';
import api from '../utils/api';

const Support = () => {
  const { isDarkMode } = useTheme();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const response = await api.get('/dashboard/support/tickets');
      if (response.success) {
        setTickets(response.tickets);
      }
    } catch (error) {
      console.error('Error fetching tickets:', error);
    }
  };

  const handleReply = async (ticketId) => {
    if (!replyMessage.trim()) return;

    setLoading(true);
    try {
      const response = await api.post(`/dashboard/support/tickets/${ticketId}/reply`, {
        message: replyMessage,
        isDM: selectedTicket?.isDM || false
      });
      
      if (response.success) {
        setMessage('Reply sent successfully!');
        setReplyMessage('');
        setSelectedTicket(null);
        fetchTickets();
      } else {
        setMessage('Failed to send reply. Please try again.');
      }
    } catch (error) {
      console.error('Error sending reply:', error);
      setMessage('Error sending reply. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (ticketId, newStatus) => {
    setLoading(true);
    try {
      const response = await api.patch(`/dashboard/support/tickets/${ticketId}/status`, {
        status: newStatus
      });
      
      if (response.success) {
        setMessage('Ticket status updated successfully!');
        fetchTickets();
      } else {
        setMessage('Failed to update ticket status. Please try again.');
      }
    } catch (error) {
      console.error('Error updating ticket status:', error);
      setMessage('Error updating ticket status. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReply = async (ticketId, replyId) => {
    if (!window.confirm('Delete this reply?')) return;
    
    setLoading(true);
    try {
      const response = await api.delete(`/dashboard/support/tickets/${ticketId}/replies/${replyId}`);
      
      if (response.success) {
        setMessage('Reply deleted successfully!');
        fetchTickets();
      } else {
        setMessage('Failed to delete reply. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting reply:', error);
      setMessage('Error deleting reply. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    if (filter === 'all') return true;
    return ticket.status === filter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'var(--alert-warning)';
      case 'replied': return 'var(--alert-info)';
      case 'in_progress': return 'var(--alert-info)';
      case 'resolved': return 'var(--alert-success)';
      case 'closed': return 'var(--text-muted)';
      default: return 'var(--text-secondary)';
    }
  };

  const getStatusTextColor = (status) => {
    switch (status) {
      case 'open': return 'var(--alert-warning-text)';
      case 'replied': return 'var(--alert-info-text)';
      case 'in_progress': return 'var(--alert-info-text)';
      case 'resolved': return 'var(--alert-success-text)';
      case 'closed': return 'var(--text-primary)';
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

  const buttonStyle = {
    padding: '0.5rem 1rem',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '500',
    marginRight: '0.5rem',
    marginBottom: '0.5rem'
  };

  const inputStyle = {
    padding: '0.75rem',
    border: '1px solid var(--input-border)',
    borderRadius: '4px',
    backgroundColor: 'var(--input-bg)',
    color: 'var(--text-primary)',
    fontSize: '1rem',
    width: '100%',
    boxSizing: 'border-box',
    marginBottom: '1rem'
  };

  const textareaStyle = {
    ...inputStyle,
    minHeight: '100px',
    resize: 'vertical'
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
          🆘 Support
        </h1>
      </div>

      {message && (
        <div style={messageStyle}>
          {message}
        </div>
      )}

      <div style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ color: 'var(--text-primary)', margin: 0 }}>
            Support Tickets ({filteredTickets.length})
          </h2>
          <div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              style={inputStyle}
            >
              <option value="all">All Tickets</option>
              <option value="open">Open</option>
              <option value="replied">Replied</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>

        {filteredTickets.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem' }}>
            No tickets found for the selected filter.
          </p>
        ) : (
          filteredTickets.map(ticket => (
            <div key={ticket.id} style={cardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ color: 'var(--text-primary)', margin: '0 0 0.5rem 0' }}>
                    #{ticket.id} - {ticket.category}
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', margin: '0 0 0.5rem 0' }}>
                    From: {ticket.student_name} ({ticket.student_email})
                  </p>
                  <p style={{ color: 'var(--text-muted)', margin: '0 0 0.5rem 0', fontSize: '0.9rem' }}>
                    📱 Telegram ID: {ticket.telegram_user_id} | Username: @{ticket.telegram_username || 'N/A'}
                  </p>
                  <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.9rem' }}>
                    Created: {new Date(ticket.created_at).toLocaleString()}
                  </p>
                </div>
                <div>
                  <span style={{
                    backgroundColor: getStatusColor(ticket.status),
                    color: getStatusTextColor(ticket.status),
                    padding: '0.25rem 0.75rem',
                    borderRadius: '12px',
                    fontSize: '0.8rem',
                    fontWeight: '500',
                    textTransform: 'uppercase'
                  }}>
                    {ticket.status.replace('_', ' ')}
                  </span>
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <strong style={{ color: 'var(--text-primary)' }}>Subject:</strong>
                <p style={{ color: 'var(--text-primary)', margin: '0.5rem 0' }}>
                  {ticket.subject}
                </p>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <strong style={{ color: 'var(--text-primary)' }}>Message:</strong>
                <p style={{ color: 'var(--text-primary)', margin: '0.5rem 0', whiteSpace: 'pre-wrap' }}>
                  {ticket.message}
                </p>
              </div>

              {ticket.replies && ticket.replies.length > 0 && (
                <div style={{ marginBottom: '1rem' }}>
                  <strong style={{ color: 'var(--text-primary)' }}>Replies ({ticket.replies.length}):</strong>
                  {ticket.replies.map((reply, index) => (
                    <div key={reply.id || index} style={{
                      backgroundColor: 'var(--card-bg)',
                      border: '1px solid var(--border-color)',
                      padding: '1rem',
                      borderRadius: '4px',
                      marginTop: '0.5rem',
                      position: 'relative'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                        <div>
                          <strong style={{ color: 'var(--text-primary)' }}>
                            {reply.sender_type === 'counselor' ? 'Counselor' : 'Student'}: 
                            {reply.counselor_name || 'Unknown'}
                          </strong>
                        </div>
                        <button
                          onClick={() => handleDeleteReply(ticket.id, reply.id)}
                          style={{
                            backgroundColor: 'var(--btn-danger)',
                            color: 'white',
                            border: 'none',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '0.7rem'
                          }}
                          title="Delete reply"
                        >
                          ✕
                        </button>
                      </div>
                      <p style={{ color: 'var(--text-primary)', margin: '0 0 0.5rem 0', whiteSpace: 'pre-wrap' }}>
                        {reply.message}
                      </p>
                      <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.8rem' }}>
                        {new Date(reply.created_at).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button
                  onClick={() => setSelectedTicket(ticket)}
                  style={{
                    ...buttonStyle,
                    backgroundColor: 'var(--btn-primary)',
                    color: 'white'
                  }}
                >
                  Reply
                </button>
                
                <button
                  onClick={() => setSelectedTicket({...ticket, isDM: true})}
                  style={{
                    ...buttonStyle,
                    backgroundColor: 'var(--counseling-accent)',
                    color: 'white'
                  }}
                  title="Send Direct Message"
                >
                  💬 DM
                </button>
                
                {ticket.status === 'open' && (
                  <button
                    onClick={() => handleStatusChange(ticket.id, 'in_progress')}
                    style={{
                      ...buttonStyle,
                      backgroundColor: 'var(--btn-info)',
                      color: 'white'
                    }}
                  >
                    Mark In Progress
                  </button>
                )}
                
                {ticket.status === 'in_progress' && (
                  <button
                    onClick={() => handleStatusChange(ticket.id, 'resolved')}
                    style={{
                      ...buttonStyle,
                      backgroundColor: 'var(--btn-success)',
                      color: 'white'
                    }}
                  >
                    Mark Resolved
                  </button>
                )}
                
                {ticket.status === 'resolved' && (
                  <button
                    onClick={() => handleStatusChange(ticket.id, 'closed')}
                    style={{
                      ...buttonStyle,
                      backgroundColor: 'var(--btn-secondary)',
                      color: 'white'
                    }}
                  >
                    Close Ticket
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Reply Modal */}
      {selectedTicket && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'var(--card-bg)',
            borderRadius: '8px',
            padding: '2rem',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <h3 style={{ color: 'var(--text-primary)', marginBottom: '1rem' }}>
              {selectedTicket.isDM ? '💬 Send Direct Message' : 'Reply to Ticket'} #{selectedTicket.id}
            </h3>
            
            <div style={{ marginBottom: '1rem' }}>
              <strong style={{ color: 'var(--text-primary)' }}>Original Message:</strong>
              <p style={{ color: 'var(--text-primary)', margin: '0.5rem 0', whiteSpace: 'pre-wrap' }}>
                {selectedTicket.message}
              </p>
            </div>

            <textarea
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
              placeholder={selectedTicket.isDM ? "Type your direct message here..." : "Type your reply here..."}
              style={textareaStyle}
            />

            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
              <button
                onClick={() => {
                  setSelectedTicket(null);
                  setReplyMessage('');
                }}
                style={{
                  ...buttonStyle,
                  backgroundColor: 'var(--btn-secondary)',
                  color: 'white'
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleReply(selectedTicket.id)}
                disabled={loading || !replyMessage.trim()}
                style={{
                  ...buttonStyle,
                  backgroundColor: 'var(--btn-primary)',
                  color: 'white',
                  opacity: loading || !replyMessage.trim() ? 0.7 : 1,
                  cursor: loading || !replyMessage.trim() ? 'not-allowed' : 'pointer'
                }}
              >
                {loading ? 'Sending...' : (selectedTicket.isDM ? 'Send DM' : 'Send Reply')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Support;
