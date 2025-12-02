import axios from "axios";

const API = axios.create({
    baseURL: 'http://localhost:5000/api'
});

//Interceptor para agregar el token automaticamente
API.interceptors.request.use((config)=>{
    const token = localStorage.getItem('token');
    if(token){
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

//Funciones de autenticación
export const register = (data) => API.post('./auth/register', data)
export const login = (data) => API.post('/auth/login', data);

//Funciones de examenes
export const getExamenes = () =>API.get('/examenes');
export const createExamen = (data) =>API.post('/examenes', data);
export const updateExamen = (id, data) => API.put(`/examenes/${id}`, data);
export const deleteExamen = (id) => API.delete(`/examenes/${id}`);

//Funciones de trabajos
export const getTrabajos = () => API.get('/trabajos');
export const createTrabajo = (data) => API.post('/trabajos', data);
export const updateTrabajo = (id, data) => API.put(`/trabajos/${id}`, data);
export const deleteTrabajo = (id) => API.delete(`/trabajos/${id}`)

//Funciones de horarios
export const getHorarios = () => API.get('/horarios');
export const createHorario = (data) => API.post('/horarios', data);
export const deleteHorario = (id) => API.delete(`/horarios/${id}`);

export default API;