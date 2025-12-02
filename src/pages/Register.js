import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import {useNavigate, Link} from 'react-router-dom';
import './Auth.css';

const Register = () =>{
    const [formData, setFormData] = useState ({
        nombre:'',
        email: '',
        password:''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const {register} = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) =>{
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const {nombre,email,password} = formData;

        if (!nombre||!email||!password){
            setError('Todos los campos son obligatorios');
            setLoading(false);
            return;
        }

        if (password.length < 6){
            setError('La contraseña debe tener al menos 6 caracteres');
            setLoading(false);
            return;
        }

        const result = await register(nombre, email, password);

        setLoading(false);

        if(result.success){
            navigate('/');
        } else {
            setError(result.message);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h1>Agenda Estudiantil</h1>
                <h2>Crear cuenta</h2>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Nombre </label>
                        <input
                        type="text"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        placeholder="Ej: Luis Gomez" />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input 
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="tuemail@gmail.com"/>
                    </div>
                    <div className="form-group">
                        <label>Contraseña</label>
                        <input 
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Mínimo 6 caracteres"/>
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? 'Registrando...' : 'Registrarse'}
                    </button>
                </form>

                <p className="auth-link">
                    ¿Ya tienes tu cuenta? <Link to="/login">Inicia sesión</Link>
                </p>
            </div>
        </div>
    )
}

export default Register;