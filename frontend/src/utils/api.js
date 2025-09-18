export async function fetchWithAuth(url, options = {}) {
  const token = localStorage.getItem("token");

  const res = await fetch(`http://localhost:4000/api${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }
  return res.json();
}

// Create a default export with axios-like API for the new pages
const api = {
  get: async (url) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`http://localhost:4000/api${url}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      const error = new Error(`API error: ${res.status}`);
      error.response = { data: errorData, status: res.status };
      throw error;
    }
    return res.json();
  },
  
  post: async (url, data) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`http://localhost:4000/api${url}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      const error = new Error(`API error: ${res.status}`);
      error.response = { data: errorData, status: res.status };
      throw error;
    }
    return res.json();
  },
  
  put: async (url, data) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`http://localhost:4000/api${url}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      const error = new Error(`API error: ${res.status}`);
      error.response = { data: errorData, status: res.status };
      throw error;
    }
    return res.json();
  },
  
  delete: async (url) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`http://localhost:4000/api${url}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      const error = new Error(`API error: ${res.status}`);
      error.response = { data: errorData, status: res.status };
      throw error;
    }
    return res.json();
  }
};

export default api;
