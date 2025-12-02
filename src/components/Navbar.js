import React, { useContext } from 'react';
import {Link, useNavigate, useLocation} from 'react-router-dom';
import {AuthContext} from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
    const {user, logout} = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () =>{
        logout();
        navigate('/login');
    };

    const isActive = (path) => {
        return location.pathname === path ? 'active' : '';
    };

    return (
        <nav className='navbar'>
            <div className='navbar-container'>
                <Link to='/' className='navbar-logo'>
                Agenda Estudiantil
                </Link>

                <div className='navbar-menu'>
                    <Link to='/' className={`nav-link ${isActive('/')}`}>
                        Inicio
                    </Link>
                    <Link to='/examenes' className={`nav-link ${isActive('/examenes')}`}>
                        Examenes
                    </Link>
                    <Link to='/trabajos' className={`nav-link ${isActive('/trabajos')}`}>
                        Trabajos
                    </Link>
                    <Link to='/horario' className={`nav-link ${isActive('/horario')}`}>
                        Horario
                    </Link>
                    <Link to='/pomodoro' className={`nav-link ${isActive('/pomodoro')}`}>
                        Pomodoro
                    </Link>
                </div>

                <div className='navbar-user'>
                    <span className='user-name'>👤 {user?.nombre}</span>
                    <button onClick={handleLogout} className='btn-logout-nav'>
                        Cerrar Sesión
                    </button>
                </div>
            </div>
        </nav>
    )
}

export default Navbar;