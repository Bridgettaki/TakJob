const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
console.log("API URL:", import.meta.env.VITE_API_BASE_URL);

export const AUTH_API_ENDPOINT = `${API_BASE_URL}/auth`;
export const USER_API_ENDPOINT= `${API_BASE_URL}`;
export const JOB_API_ENDPOINT= `${API_BASE_URL}/jobs`;
export const APPLICATION_API_ENDPOINT= `${API_BASE_URL}/applications`;
export const COMPANY_API_ENDPOINT= `${API_BASE_URL}/companies`;


