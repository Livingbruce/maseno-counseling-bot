import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../AuthContext';
import { useTheme } from '../ThemeContext';
import { fetchWithAuth } from '../utils/api';

const SupportTickets = () => {
  const { user } = useContext(AuthContext);
  const { isDarkMode } = useTheme();
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalTickets: 0,
    limit: 20,
    hasNext: false,
    hasPrev: false
  });
  const [messagePagination, setMessagePagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalMessages: 0,
    limit: 50,
    hasNext: false,
    hasPrev: false
  });

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async (page = 1) => {
    try {
      setLoading(true);
      const response = await fetchWithAuth(`/dashboard/support/tickets?page=${page}&limit=20`);
      if (response.success) {
        setTickets(response.tickets || []);
        setPagination(response.pagination || {
          currentPage: 1,
          totalPages: 1,
          totalTickets: 0,
          limit: 20,
          hasNext: false,
          hasPrev: false
        });
      }
    } catch (error) {
      console.error('Error loading support tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTicketMessages = async (ticketId, page = 1) => {
    try {
      setMessagesLoading(true);
      const response = await fetchWithAuth(`/dashboard/support/tickets/${ticketId}/messages?page=${page}&limit=50`);
      if (response.success) {
        setMessages(response.messages || []);
        setMessagePagination(response.pagination || {
          currentPage: 1,
          totalPages: 1,
          totalMessages: 0,
          limit: 50,
          hasNext: false,
          hasPrev: false
        });
      }
    } catch (error) {
      console.error('Error loading ticket messages:', error);
    } finally {
      setMessagesLoading(false);
    }
  };

  const openChat = async (ticket) => {
    setSelectedTicket(ticket);
    setShowChatModal(true);
    await loadTicketMessages(ticket.id);
  };

  const closeChat = () => {
    setShowChatModal(false);
    setSelectedTicket(null);
    setMessages([]);
    setNewMessage('');
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedTicket) return;

    try {
      setSendingMessage(true);
      const response = await fetchWithAuth(`/dashboard/support/tickets/${selectedTicket.id}/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: newMessage.trim() })
      });

      if (response.success) {
        setNewMessage('');
        await loadTicketMessages(selectedTicket.id);
        await loadTickets(); // Refresh tickets list
      } else {
        alert('Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Error sending message. Please try again.');
    } finally {
      setSendingMessage(false);
    }
  };

  const updateTicketStatus = async (ticketId, newStatus) => {
    try {
      const response = await fetchWithAuth(`/dashboard/support/tickets/${ticketId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.success) {
        await loadTickets();
        if (selectedTicket && selectedTicket.id === ticketId) {
          setSelectedTicket({ ...selectedTicket, status: newStatus });
        }
      } else {
        alert('Failed to update ticket status. Please try again.');
      }
    } catch (error) {
      console.error('Error updating ticket status:', error);
      alert('Error updating ticket status. Please try again.');
    }
  };

  const deleteTicket = async (ticketId) => {
    if (!window.confirm('Are you sure you want to delete this ticket? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetchWithAuth(`/dashboard/support/tickets/${ticketId}`, {
        method: 'DELETE'
      });

      if (response.success) {
        await loadTickets();
        if (selectedTicket && selectedTicket.id === ticketId) {
          closeChat();
        }
        alert('Ticket deleted successfully!');
      } else {
        alert('Failed to delete ticket. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting ticket:', error);
      alert('Error deleting ticket. Please try again.');
    }
  };

  const clearTicketMessages = async (ticketId) => {
    if (!window.confirm('Are you sure you want to clear all messages in this ticket? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetchWithAuth(`/dashboard/support/tickets/${ticketId}/clear-messages`, {
        method: 'DELETE'
      });

      if (response.success) {
        await loadTicketMessages(ticketId);
        alert('Messages cleared successfully!');
      } else {
        alert('Failed to clear messages. Please try again.');
      }
    } catch (error) {
      console.error('Error clearing messages:', error);
      alert('Error clearing messages. Please try again.');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return '#EF4444';
      case 'replied': return '#F59E0B';
      case 'in_progress': return '#3B82F6';
      case 'resolved': return '#10B981';
      case 'closed': return '#6B7280';
      default: return '#6B7280';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'open': return '🔴';
      case 'replied': return '🟡';
      case 'in_progress': return '🔵';
      case 'resolved': return '🟢';
      case 'closed': return '⚫';
      default: return '⚫';
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now - date) / (1000 * 60));
      return diffInMinutes < 1 ? 'Just now' : `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '50vh',
        fontSize: '18px',
        color: 'var(--text-muted)'
      }}>
        Loading support tickets...
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px'
      }}>
        <h1 style={{
          color: 'var(--text-primary)',
          fontSize: '28px',
          fontWeight: '600',
          margin: 0
        }}>
          Support Tickets
        </h1>
        <button
          onClick={loadTickets}
          style={{
            background: 'var(--accent-color)',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          Refresh
        </button>
      </div>

      {/* Tickets List - WhatsApp Style */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '16px',
        marginBottom: '24px'
      }}>
        {tickets.map((ticket) => (
          <div
            key={ticket.id}
            onClick={() => openChat(ticket)}
            style={{
              background: 'var(--card-bg)',
              border: '1px solid var(--border-color)',
              borderRadius: '12px',
              padding: '16px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              position: 'relative'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}
          >
            {/* Status Badge */}
            <div style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              background: getStatusColor(ticket.status),
              color: 'white',
              padding: '4px 8px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              {getStatusIcon(ticket.status)} {ticket.status.toUpperCase()}
            </div>

            {/* Student Info */}
            <div style={{ marginBottom: '12px' }}>
              <h3 style={{
                color: 'var(--text-primary)',
                fontSize: '16px',
                fontWeight: '600',
                margin: '0 0 4px 0'
              }}>
                {ticket.student_name || 'Unknown Student'}
              </h3>
              <p style={{
                color: 'var(--text-secondary)',
                fontSize: '14px',
                margin: '0 0 4px 0'
              }}>
                {ticket.admission_no || 'N/A'}
              </p>
              <p style={{
                color: 'var(--text-muted)',
                fontSize: '12px',
                margin: 0
              }}>
                {formatTime(ticket.created_at)}
              </p>
            </div>

            {/* Subject */}
            <div style={{ marginBottom: '12px' }}>
              <h4 style={{
                color: 'var(--text-primary)',
                fontSize: '14px',
                fontWeight: '500',
                margin: '0 0 4px 0'
              }}>
                {ticket.subject}
              </h4>
              <p style={{
                color: 'var(--text-secondary)',
                fontSize: '13px',
                margin: 0,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}>
                {ticket.description}
              </p>
            </div>

            {/* Priority */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{
                background: ticket.priority === 'urgent' ? '#EF4444' : 
                           ticket.priority === 'high' ? '#F59E0B' :
                           ticket.priority === 'medium' ? '#3B82F6' : '#10B981',
                color: 'white',
                padding: '2px 8px',
                borderRadius: '8px',
                fontSize: '11px',
                fontWeight: '500'
              }}>
                {ticket.priority.toUpperCase()}
              </span>
              <span style={{
                color: 'var(--text-muted)',
                fontSize: '11px'
              }}>
                #{ticket.id}
              </span>
            </div>
          </div>
        ))}
      </div>

      {tickets.length === 0 && !loading && (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          color: 'var(--text-muted)'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎫</div>
          <h3 style={{ margin: '0 0 8px 0' }}>No Support Tickets</h3>
          <p style={{ margin: 0 }}>No support tickets have been created yet.</p>
        </div>
      )}

      {/* Pagination Controls */}
      {pagination.totalPages > 1 && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '12px',
          marginTop: '24px',
          padding: '16px',
          background: 'var(--card-bg)',
          borderRadius: '8px',
          border: '1px solid var(--border-color)'
        }}>
          <button
            onClick={() => loadTickets(pagination.currentPage - 1)}
            disabled={!pagination.hasPrev}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              border: '1px solid var(--border-color)',
              background: pagination.hasPrev ? 'var(--accent-color)' : 'var(--btn-secondary)',
              color: 'white',
              cursor: pagination.hasPrev ? 'pointer' : 'not-allowed',
              fontSize: '14px'
            }}
          >
            Previous
          </button>
          
          <span style={{
            color: 'var(--text-primary)',
            fontSize: '14px',
            fontWeight: '500'
          }}>
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          
          <button
            onClick={() => loadTickets(pagination.currentPage + 1)}
            disabled={!pagination.hasNext}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              border: '1px solid var(--border-color)',
              background: pagination.hasNext ? 'var(--accent-color)' : 'var(--btn-secondary)',
              color: 'white',
              cursor: pagination.hasNext ? 'pointer' : 'not-allowed',
              fontSize: '14px'
            }}
          >
            Next
          </button>
        </div>
      )}

      {/* Chat Modal */}
      {showChatModal && selectedTicket && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            background: 'var(--card-bg)',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '600px',
            height: '80vh',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}>
            {/* Chat Header */}
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid var(--border-color)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: 'var(--accent-color)',
              color: 'white'
            }}>
              <div>
                <h3 style={{ margin: '0 0 4px 0', fontSize: '16px' }}>
                  {selectedTicket.student_name || 'Unknown Student'}
                </h3>
                <p style={{ margin: 0, fontSize: '12px', opacity: 0.8 }}>
                  {selectedTicket.admission_no || 'N/A'} • #{selectedTicket.id}
                </p>
              </div>
              <button
                onClick={closeChat}
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  border: 'none',
                  color: 'white',
                  padding: '8px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  fontSize: '18px'
                }}
              >
                ×
              </button>
            </div>

            {/* Status Controls */}
            <div style={{
              padding: '12px 20px',
              borderBottom: '1px solid var(--border-color)',
              display: 'flex',
              gap: '8px',
              flexWrap: 'wrap'
            }}>
              <select
                value={selectedTicket.status}
                onChange={(e) => updateTicketStatus(selectedTicket.id, e.target.value)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-color)',
                  background: 'var(--input-bg)',
                  color: 'var(--text-primary)',
                  fontSize: '12px'
                }}
              >
                <option value="open">Open</option>
                <option value="replied">Replied</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
              <button
                onClick={() => clearTicketMessages(selectedTicket.id)}
                style={{
                  background: '#F59E0B',
                  color: 'white',
                  border: 'none',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                Clear Messages
              </button>
              <button
                onClick={() => deleteTicket(selectedTicket.id)}
                style={{
                  background: '#EF4444',
                  color: 'white',
                  border: 'none',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                Delete Ticket
              </button>
            </div>

            {/* Messages Area */}
            <div style={{
              flex: 1,
              padding: '16px 20px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              {/* Message Pagination Controls */}
              {messagePagination.totalPages > 1 && (
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px',
                  background: 'var(--hover-bg)',
                  borderRadius: '6px',
                  marginBottom: '8px'
                }}>
                  <button
                    onClick={() => loadTicketMessages(selectedTicket.id, messagePagination.currentPage - 1)}
                    disabled={!messagePagination.hasPrev}
                    style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      border: '1px solid var(--border-color)',
                      background: messagePagination.hasPrev ? 'var(--accent-color)' : 'var(--btn-secondary)',
                      color: 'white',
                      cursor: messagePagination.hasPrev ? 'pointer' : 'not-allowed',
                      fontSize: '12px'
                    }}
                  >
                    ↑ Older
                  </button>
                  
                  <span style={{
                    color: 'var(--text-muted)',
                    fontSize: '12px'
                  }}>
                    {messagePagination.currentPage} / {messagePagination.totalPages}
                  </span>
                  
                  <button
                    onClick={() => loadTicketMessages(selectedTicket.id, messagePagination.currentPage + 1)}
                    disabled={!messagePagination.hasNext}
                    style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      border: '1px solid var(--border-color)',
                      background: messagePagination.hasNext ? 'var(--accent-color)' : 'var(--btn-secondary)',
                      color: 'white',
                      cursor: messagePagination.hasNext ? 'pointer' : 'not-allowed',
                      fontSize: '12px'
                    }}
                  >
                    Newer ↓
                  </button>
                </div>
              )}

              {messagesLoading ? (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                  Loading messages...
                </div>
              ) : messages.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                  No messages yet. Start the conversation!
                </div>
              ) : (
                messages.map((message, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      justifyContent: message.sender_type === 'counselor' ? 'flex-end' : 'flex-start',
                      marginBottom: '8px'
                    }}
                  >
                    <div style={{
                      maxWidth: '70%',
                      padding: '8px 12px',
                      borderRadius: message.sender_type === 'counselor' ? '12px 12px 4px 12px' : '12px 12px 12px 4px',
                      background: message.sender_type === 'counselor' ? 'var(--accent-color)' : 'var(--message-bg)',
                      color: message.sender_type === 'counselor' ? 'white' : 'var(--text-primary)',
                      fontSize: '14px',
                      lineHeight: '1.4'
                    }}>
                      <div style={{ marginBottom: '4px' }}>
                        <strong>{message.sender_type === 'counselor' ? 'You' : 'Student'}</strong>
                        <span style={{ 
                          marginLeft: '8px', 
                          fontSize: '11px', 
                          opacity: 0.7 
                        }}>
                          {formatTime(message.created_at)}
                        </span>
                      </div>
                      <div>{message.message}</div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Message Input */}
            <div style={{
              padding: '16px 20px',
              borderTop: '1px solid var(--border-color)',
              display: 'flex',
              gap: '8px'
            }}>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type your message..."
                style={{
                  flex: 1,
                  padding: '10px 12px',
                  borderRadius: '20px',
                  border: '1px solid var(--border-color)',
                  background: 'var(--input-bg)',
                  color: 'var(--text-primary)',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
              <button
                onClick={sendMessage}
                disabled={!newMessage.trim() || sendingMessage}
                style={{
                  background: sendingMessage ? '#ccc' : 'var(--accent-color)',
                  color: 'white',
                  border: 'none',
                  padding: '10px 16px',
                  borderRadius: '20px',
                  cursor: sendingMessage ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                {sendingMessage ? 'Sending...' : 'Send'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupportTickets;
