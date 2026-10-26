import axios from 'axios';
export const api=axios.create({baseURL:import.meta.env.VITE_API_BASE_URL||'http://localhost:4000/api',timeout:15000});
api.interceptors.request.use(c=>{const token=localStorage.getItem('hcm-token');if(token)c.headers.Authorization=`Bearer ${token}`;return c;});
api.interceptors.response.use(r=>r,err=>{if(err.response?.status===401){localStorage.removeItem('hcm-token');window.dispatchEvent(new Event('hcm:logout'));}return Promise.reject(new Error(err.response?.data?.error||err.message||'Request failed'));});
