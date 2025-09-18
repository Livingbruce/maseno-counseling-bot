import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";

export default function Books() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingBook, setEditingBook] = useState(null);
  const [form, setForm] = useState({
    title: "",
    author: "",
    price: "",
    pickup_station: "",
  });

  // Fetch books
  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.get("/dashboard/books");
      setBooks(data);
    } catch (err) {
      console.error("Error loading books:", err);
      setError("Failed to load books");
    } finally {
      setLoading(false);
    }
  };

  // Handle input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Add/Update book
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.author.trim() || !form.price || !form.pickup_station.trim()) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const bookData = {
        title: form.title,
        author: form.author,
        price_cents: Math.round(parseFloat(form.price) * 100),
        pickup_station: form.pickup_station,
      };

      if (editingBook) {
        // Update existing book
        const updatedBook = await api.put(`/dashboard/books/${editingBook.id}`, bookData);
        setBooks(books.map((book) => 
          book.id === editingBook.id ? updatedBook : book
        ));
        setEditingBook(null);
      } else {
        // Add new book
        const newBook = await api.post("/dashboard/books", bookData);
        setBooks([newBook, ...books]);
      }

      // Reset form
      setForm({
        title: "",
        author: "",
        price: "",
        pickup_station: "",
      });
    } catch (err) {
      console.error("Error saving book:", err);
      setError("Failed to save book");
    } finally {
      setLoading(false);
    }
  };

  // Delete book
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this book?")) return;

    try {
      setLoading(true);
      await api.delete(`/dashboard/books/${id}`);
      setBooks(books.filter((book) => book.id !== id));
      setError(null);
    } catch (err) {
      console.error("Error deleting book:", err);
      setError("Failed to delete book");
    } finally {
      setLoading(false);
    }
  };

  // Edit book (populate form)
  const handleEdit = (book) => {
    setEditingBook(book);
    setForm({
      title: book.title,
      author: book.author,
      price: (book.price_cents / 100).toFixed(2),
      pickup_station: book.pickup_station,
    });
  };

  // Cancel edit
  const handleCancelEdit = () => {
    setEditingBook(null);
    setForm({
      title: "",
      author: "",
      price: "",
      pickup_station: "",
    });
  };

  const formatPrice = (priceCents) => {
    return `KES ${(priceCents / 100).toFixed(2)}`;
  };

  const cardStyle = {
    backgroundColor: 'var(--card-bg)',
    border: '1px solid var(--border-color)',
    borderRadius: '12px',
    padding: '1.5rem',
    boxShadow: 'var(--shadow)',
    marginBottom: '1rem'
  };

  const inputStyle = {
    padding: '0.75rem',
    border: '1px solid var(--input-border)',
    borderRadius: '6px',
    backgroundColor: 'var(--input-bg)',
    color: 'var(--text-primary)',
    fontSize: '1rem',
    width: '100%',
    boxSizing: 'border-box'
  };

  const buttonStyle = {
    backgroundColor: 'var(--btn-primary)',
    color: 'white',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '500',
    transition: 'all 0.2s ease'
  };

  const deleteButtonStyle = {
    backgroundColor: 'var(--btn-danger)',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: '500',
    transition: 'all 0.2s ease'
  };

  if (loading && books.length === 0) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-primary)' }}>
        <p>Loading books...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Back Button */}
      <div style={{ marginBottom: '1.5rem' }}>
        <Link 
          to="/" 
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 16px",
            backgroundColor: "var(--btn-secondary)",
            color: "var(--text-primary)",
            textDecoration: "none",
            borderRadius: "6px",
            fontSize: "14px",
            fontWeight: "500",
            transition: "all 0.2s ease"
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = "var(--btn-secondary-hover)";
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "var(--btn-secondary)";
          }}
        >
          <span>←</span>
          <span>Back to Dashboard</span>
        </Link>
      </div>
      
      <h1 style={{ color: 'var(--text-primary)', marginBottom: '1.5rem', fontSize: '28px', fontWeight: '700' }}>
        📚 Books
      </h1>

      {error && (
        <div style={{
          backgroundColor: "var(--alert-danger)",
          color: "var(--alert-danger-text)",
          padding: "12px",
          borderRadius: "6px",
          marginBottom: "1.5rem",
          border: "1px solid var(--border-color)"
        }}>
          {error}
        </div>
      )}

      {/* Add/Edit Book Form */}
      <div style={cardStyle}>
        <h3 style={{ color: 'var(--text-primary)', marginBottom: '1rem', fontSize: '20px', fontWeight: '600' }}>
          {editingBook ? "Edit Book" : "Add New Book"}
        </h3>
        <form onSubmit={handleSubmit}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "15px" }}>
            <input
              type="text"
              name="title"
              placeholder="Book Title"
              value={form.title}
              onChange={handleChange}
              required
              disabled={loading}
              style={inputStyle}
            />
            <input
              type="text"
              name="author"
              placeholder="Author Name"
              value={form.author}
              onChange={handleChange}
              required
              disabled={loading}
              style={inputStyle}
            />
            <input
              type="number"
              step="0.01"
              name="price"
              placeholder="Price (KES)"
              value={form.price}
              onChange={handleChange}
              required
              disabled={loading}
              style={inputStyle}
            />
            <input
              type="text"
              name="pickup_station"
              placeholder="Pickup Station"
              value={form.pickup_station}
              onChange={handleChange}
              required
              disabled={loading}
              style={inputStyle}
            />
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <button 
              type="submit" 
              disabled={loading}
              style={{
                ...buttonStyle,
                opacity: loading ? 0.7 : 1,
                cursor: loading ? "not-allowed" : "pointer"
              }}
            >
              {loading ? "Saving..." : (editingBook ? "Update Book" : "Add Book")}
            </button>
            {editingBook && (
              <button 
                type="button"
                onClick={handleCancelEdit}
                disabled={loading}
                style={{
                  backgroundColor: "var(--btn-secondary)",
                  color: "var(--text-primary)",
                  border: "none",
                  padding: "10px 20px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontWeight: "500"
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* List Books */}
      <div>
        <h3 style={{ color: 'var(--text-primary)', marginBottom: '1rem', fontSize: '20px', fontWeight: '600' }}>
          Available Books ({books.length})
        </h3>
        {books.length === 0 ? (
          <div style={{
            backgroundColor: "var(--card-bg)",
            padding: "2rem",
            borderRadius: "12px",
            border: "1px solid var(--border-color)",
            textAlign: "center",
            boxShadow: "var(--shadow)"
          }}>
            <p style={{ color: "var(--text-muted)", fontStyle: "italic", margin: 0 }}>
              No books available.
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {books.map((book) => (
              <div key={book.id} style={cardStyle}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: "0 0 8px 0", fontWeight: "500", fontSize: "16px", color: "var(--text-primary)" }}>
                      {book.title}
                    </p>
                    <p style={{ margin: "0 0 8px 0", fontSize: "14px", color: "var(--text-secondary)" }}>
                      by {book.author || "Unknown Author"}
                    </p>
                    <p style={{ margin: "0 0 8px 0", fontSize: "14px", color: "var(--text-secondary)" }}>
                      Pickup: {book.pickup_station || "TBD"}
                    </p>
                    <p style={{ margin: "0", fontSize: "16px", fontWeight: "500", color: "var(--btn-success)" }}>
                      {formatPrice(book.price_cents)}
                    </p>
                  </div>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button
                      onClick={() => handleEdit(book)}
                      disabled={loading}
                      style={{
                        backgroundColor: "var(--btn-warning)",
                        color: "white",
                        border: "none",
                        padding: "6px 12px",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontSize: "12px",
                        fontWeight: "500"
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(book.id)}
                      disabled={loading}
                      style={deleteButtonStyle}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
