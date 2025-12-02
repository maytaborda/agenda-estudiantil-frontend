import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import {useNavigate, Link} from 'react-router-dom';
import './Auth.css';

const Login = () =>{
    const [formData, setFormData] = useState({
        email:'',
        password:''
    });
    const [error, setError]=useState('');
    const [loading, setLoading]=useState(false);

    const {login} = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData ({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const {email, password} = formData;

        if (!email || !password){
            setError('Todos los campos son obligatorios');
            setLoading(false);
            return;
        }

        const result = await login(email, password);

        setLoading(false);

        if(result.success){
            navigate('/');
        } else {
            setError(result.message)
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h1>Agenda Estudiantil</h1>
                <h2>Iniciar Sesión</h2>

                <form onSubmit={handleSubmit}>
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
                        placeholder="Tu contraseña"/>
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                    </button>
                </form>

                <p className="auth-link">
                    ¿No tienes cuenta? <Link to="/register">Registrate</Link>
                </p>
            </div>
        </div>
    )
}

export default Login;