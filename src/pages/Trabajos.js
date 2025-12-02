import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'
import Navbar from '../components/Navbar';
import EventCard from '../components/EventCard';
import { getTrabajos, createTrabajo, updateTrabajo, deleteTrabajo } from '../services/api';
import './Trabajos.css';

const Trabajos = () => {
  const location = useLocation();
  const [trabajos, setTrabajos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editando, setEditando] = useState(null);
  const [formData, setFormData] = useState({
    materia: '',
    fecha: '',
    descripcion: ''
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    cargarTrabajos();
  }, []);

  useEffect(() => {
    if (location.state?.editarTrabajo) {
      handleEdit(location.state.editarTrabajo);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const cargarTrabajos = async () => {
    try {
      const response = await getTrabajos();
      setTrabajos(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error al cargar trabajos:', error);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.materia || !formData.fecha || !formData.descripcion) {
      setError('Todos los campos son obligatorios');
      return;
    }

    setSubmitting(true);

    try {
      if (editando) {
        // Actualizar
        const response = await updateTrabajo(editando._id, formData);
        setTrabajos(trabajos.map(t => t._id === editando._id ? response.data.trabajo : t));
        setEditando(null);
      } else {
        // Crear
        const response = await createTrabajo(formData);
        setTrabajos([...trabajos, response.data.trabajo]);
      }
      setFormData({ materia: '', fecha: '', descripcion: '' });
      setShowForm(false);
      setError('');
    } catch (error) {
      setError(error.response?.data?.message || 'Error al guardar el trabajo');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (trabajo) => {
  setEditando(trabajo);
  
  // Normalizar fecha para el input
  const fecha = new Date(trabajo.fecha);
  const year = fecha.getUTCFullYear();
  const month = String(fecha.getUTCMonth() + 1).padStart(2, '0');
  const day = String(fecha.getUTCDate()).padStart(2, '0');
  
  setFormData({
    materia: trabajo.materia,
    fecha: `${year}-${month}-${day}`,
    descripcion: trabajo.descripcion
  });
  setShowForm(true);
};

  const handleCancelar = () => {
    setShowForm(false);
    setEditando(null);
    setFormData({ materia: '', fecha: '', descripcion: '' });
    setError('');
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este trabajo?')) {
      try {
        await deleteTrabajo(id);
        setTrabajos(trabajos.filter(t => t._id !== id));
      } catch (error) {
        console.error('Error al eliminar trabajo:', error);
        alert('Error al eliminar el trabajo');
      }
    }
  };

  // Ordenar trabajos: próximos primero, vencidos al final
const trabajosOrdenados = [...trabajos].sort((a, b) => {
  const fechaA = new Date(a.fecha);
  fechaA.setMinutes(fechaA.getMinutes() + fechaA.getTimezoneOffset());
  fechaA.setHours(0, 0, 0, 0);
  
  const fechaB = new Date(b.fecha);
  fechaB.setMinutes(fechaB.getMinutes() + fechaB.getTimezoneOffset());
  fechaB.setHours(0, 0, 0, 0);
  
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  
  const esVencidoA = fechaA < hoy;
  const esVencidoB = fechaB < hoy;
  
  if (esVencidoA === esVencidoB) {
    return fechaA - fechaB;
  }
  
  return esVencidoA ? 1 : -1;
});

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="loading-container">
          <h2>Cargando trabajos...</h2>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="trabajos-container">
        <div className="trabajos-header">
          <div>
            <h1>📚 Trabajos Prácticos</h1>
            <p>Organiza tus trabajos y entregas</p>
          </div>
          <button 
            className="btn-add"
            onClick={() => {
              if (showForm && editando) {
                handleCancelar();
              } else {
                setShowForm(!showForm);
              }
            }}
          >
            {showForm ? '✖ Cancelar' : '➕ Agregar Trabajo'}
          </button>
        </div>

        {showForm && (
          <div className="form-card">
            <h2>{editando ? '✏️ Editar Trabajo' : 'Nuevo Trabajo Práctico'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Materia</label>
                <input
                  type="text"
                  name="materia"
                  value={formData.materia}
                  onChange={handleChange}
                  placeholder="Ej: Historia"
                />
              </div>

              <div className="form-group">
                <label>Fecha de entrega</label>
                <input
                  type="date"
                  name="fecha"
                  value={formData.fecha}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Descripción del trabajo</label>
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  placeholder="Ej: Ensayo sobre la Revolución Francesa"
                  rows="4"
                />
              </div>

              {error && <div className="error-message">{error}</div>}

              <div className="form-buttons">
                <button type="submit" className="btn-submit" disabled={submitting}>
                  {submitting ? 'Guardando...' : (editando ? '💾 Actualizar' : '💾 Guardar Trabajo')}
                </button>
                {editando && (
                  <button type="button" className="btn-cancel" onClick={handleCancelar}>
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          </div>
        )}

        <div className="trabajos-content">
          {trabajos.length === 0 ? (
            <div className="empty-state">
              <p className="empty-icon">📭</p>
              <p className="empty-text">No tienes trabajos registrados</p>
              <p className="empty-hint">Haz clic en "Agregar Trabajo" para comenzar</p>
            </div>
          ) : (
            <>
              <div className="list-header">
                <h2>Lista de Trabajos</h2>
                <span className="badge">{trabajos.length}</span>
              </div>
              <div className="trabajos-grid">
                {trabajosOrdenados.map((trabajo) => (
                  <EventCard
                    key={trabajo._id}
                    evento={trabajo}
                    tipo="trabajo"
                    onDelete={handleDelete}
                    onEdit={handleEdit}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Trabajos;