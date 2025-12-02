import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'; 
import Navbar from '../components/Navbar';
import EventCard from '../components/EventCard';
import { getExamenes, createExamen, updateExamen, deleteExamen } from '../services/api';
import './Examenes.css';

const Examenes = () => {
  const location = useLocation();
  const [examenes, setExamenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editando, setEditando] = useState(null);
  const [formData, setFormData] = useState({
    materia: '',
    fecha: '',
    temas: ''
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    cargarExamenes();
  }, []);

  useEffect(() => {
    // Si viene un examen para editar desde otra página
    if (location.state?.editarExamen) {
      handleEdit(location.state.editarExamen);
      // Limpiar el estado de navegación
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const cargarExamenes = async () => {
    try {
      const response = await getExamenes();
      setExamenes(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error al cargar exámenes:', error);
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

    if (!formData.materia || !formData.fecha || !formData.temas) {
      setError('Todos los campos son obligatorios');
      return;
    }

    setSubmitting(true);

    try {
      if (editando) {
        // Actualizar
        const response = await updateExamen(editando._id, formData);
        setExamenes(examenes.map(e => e._id === editando._id ? response.data.examen : e));
        setEditando(null);
      } else {
        // Crear
        const response = await createExamen(formData);
        setExamenes([...examenes, response.data.examen]);
      }
      setFormData({ materia: '', fecha: '', temas: '' });
      setShowForm(false);
      setError('');
    } catch (error) {
      setError(error.response?.data?.message || 'Error al guardar el examen');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (examen) => {
  setEditando(examen);
  
  // Normalizar fecha para el input
  const fecha = new Date(examen.fecha);
  const year = fecha.getUTCFullYear();
  const month = String(fecha.getUTCMonth() + 1).padStart(2, '0');
  const day = String(fecha.getUTCDate()).padStart(2, '0');
  
  setFormData({
    materia: examen.materia,
    fecha: `${year}-${month}-${day}`,
    temas: examen.temas
  });
  setShowForm(true);
};

  const handleCancelar = () => {
    setShowForm(false);
    setEditando(null);
    setFormData({ materia: '', fecha: '', temas: '' });
    setError('');
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este examen?')) {
      try {
        await deleteExamen(id);
        setExamenes(examenes.filter(e => e._id !== id));
      } catch (error) {
        console.error('Error al eliminar examen:', error);
        alert('Error al eliminar el examen');
      }
    }
  };

  // Ordenar exámenes: próximos primero, vencidos al final
const examenesOrdenados = [...examenes].sort((a, b) => {
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

  if (loading){
    return (
    <>
    <Navbar />
    <div className="loading-container">
      <h2>Cargando exámenes...</h2>
    </div>
    </>
    );
  }

  return (
    <>
    <Navbar />
    <div className="examenes-container">
      <div className="examenes-header">
        <div>
          <h1>📝 Exámenes</h1>
          <p>Gestiona tus exámenes</p>
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
            {showForm ? '✖ Cancelar' : '➕ Agregar Examen'}
          </button>
      </div>

      {showForm && (
        <div className="form-card">
          <h2>{editando ? '✏️ Editar Examen' : 'Nuevo Examen'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Materia</label>
              <input
                type="text"
                name="materia"
                value={formData.materia}
                onChange={handleChange}
                placeholder="Ej: Matemática"
              />
            </div>

            <div className="form-group">
              <label>Fecha del examen</label>
              <input
                type="date"
                name="fecha"
                value={formData.fecha}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Temas a evaluar</label>
              <textarea
                name="temas"
                value={formData.temas}
                onChange={handleChange}
                placeholder="Ej: Derivadas, integrales y límites"
                rows="4"
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className='form-buttons'>
              <button type='submit' className='btn-submit' disabled={submitting}>
                {submitting ? 'Guardando...' : (editando ? '💾 Actualizar' : '💾 Guardar Examen')}
              </button>
              {editando && (
                <button type='button' className='btn-cancel' onClick={handleCancelar}>
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      <div className="examenes-content">
        {examenes.length === 0 ? (
          <div className="empty-state">
            <p className="empty-icon">📭</p>
            <p className="empty-text">No tienes exámenes registrados</p>
            <p className="empty-hint">Haz clic en "Agregar Examen" para comenzar</p>
          </div>
        ) : (
          <>
            <div className="list-header">
              <h2>Lista de Exámenes</h2>
              <span className="badge">{examenes.length}</span>
            </div>
            <div className="examenes-grid">
              {examenesOrdenados.map((examen) => (
                <EventCard
                  key={examen._id}
                  evento={examen}
                  tipo="examen"
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

export default Examenes;