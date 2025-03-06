// Base API URL for development
export const API_URL = "/api";

// API endpoints
export const API_ENDPOINTS = {
  ping: `${API_URL}/ping`,
  downloadTest: `${API_URL}/download-test`,
  uploadTest: `${API_URL}/upload-test`,
  networkInfo: `${API_URL}/network-info`,
};

// Test file sizes (in bytes)
export const TEST_FILE_SIZES = {
  small: 1024 * 1024, // 1MB
  medium: 5 * 1024 * 1024, // 5MB
  large: 10 * 1024 * 1024, // 10MB
};

// Test durations (in milliseconds)
export const TEST_DURATIONS = {
  ping: 5000,
  download: 10000,
  upload: 10000,
};

export const API_KEY = "1234567890";

// Update the ping period to a minimum of 3 seconds (3000ms)
export const PING_INTERVAL = 3000; // previously might have been a lower value
