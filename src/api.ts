import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_DB_HOST
});

export const patientList = () => api.get('/patient/list');
export const genderList = () => api.get('/gender/list');
export const raceList = () => api.get('/race/list');
export const ethList = () => api.get('/ethnicity/list');
export const detail = (id: number) => api.get(`/patient/brief/${id.toString()}`);
export const chart = () => api.get('/patient/stats');