import axios from "axios";

const api = axios.create({
  baseURL: "http://49.50.167.136:9871/api"
});

export const patientList = () => api.get('/patient/list');
export const genderList = () => api.get('/gender/list');
export const raceList = () => api.get('/race/list');
export const ethList = () => api.get('/ethnicity/list');
export const detail = (id: number) => api.get(`/patient/brief/${id.toString()}`);
export const chart = () => api.get('/patient/stats');