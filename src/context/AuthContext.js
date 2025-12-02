import React, {createContext, useState, useEffect} from 'react';
import API from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);


useEffect(()=>{
    //Verificar si hay un usuario guardado al cargar la app
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData){
        setUser(JSON.parse(userData));
    }
    setLoading(false);
}, []);

const register = async (nombre, email, password) =>{
    try {
        const {data} = await API.post('/auth/register',{
            nombre,
            email,
            password
        });

        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);

        return {success: true};
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Error al registrar el usuario'
        };
    }
};

const login = async (email, password) => {
    try {
        const {data} = await API.post('/auth/login', {
            email,
            password
        });

        localStorage.setItem('token', data.token);
        localStorage.setItem('user',JSON.stringify(data.user));
        setUser(data.user);

        return { success: true};
    } catch (error){
        return {
            success: false,
            message: error.response?.data?.message || 'Error al iniciar sesión'
        }
    }
}

const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
};
return (
    <AuthContext.Provider value={{user, loading, register, login, logout}}>
        {children}
    </AuthContext.Provider>
);
};