const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('ba_access_token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers
  });
  
  if (response.status === 401) {
    localStorage.removeItem('ba_access_token');
    localStorage.removeItem('ba_user');
    window.location.href = '/login';
    throw new Error('Your session has expired. Please sign in again.');
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'An error occurred while communicating with the server.');
  }

  return data;
}