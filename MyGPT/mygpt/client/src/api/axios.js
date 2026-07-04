import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api"
});

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
};

export const getApiError = (error) => {
  if (!error.response) {
    return "Cannot reach the backend API. Make sure the Express server is running on port 5000.";
  }

  return error.response?.data?.message || "Something went wrong. Please try again.";
};

export default api;
