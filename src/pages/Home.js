import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import EventCard from '../components/EventCard';
import { getExamenes, getTrabajos, deleteExamen, deleteTrabajo } from '../services/api';
import './Home.css';

const Home = () => {
  const [examenes, setExamenes] = useState([]);
  const [trabajos, setTrabajos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const [resExamenes, resTrabajos] = await Promise.all([
        getExamenes(),
        getTrabajos()
      ]);

      setExamenes(resExamenes.data);
      setTrabajos(resTrabajos.data);
      setLoading(false);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      setLoading(false);
    }
  };

  const handleDeleteExamen = async (id) => {
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

  const handleDeleteTrabajo = async (id) => {
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

  const handleEditExamen = (examen) => {
    navigate('/examenes', { state: { editarExamen: examen } });
  };

  const handleEditTrabajo = (trabajo) => {
    navigate('/trabajos', { state: { editarTrabajo: trabajo } });
  };

  // Obtener los próximos 5 eventos combinados y ordenados
  const proximosEventos = [...examenes, ...trabajos]
    .sort((a, b) => {
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
    })
    .slice(0, 5);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="loading-container">
          <h2>Cargando...</h2>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="home-container">
        <div className="home-header">
          <h1>🏠 Inicio</h1>
          <p>Bienvenido a tu agenda personal</p>
        </div>

        <div className="home-content">
          <section className="recordatorios-section">
            <div className="section-header">
              <h2>📌 Próximos Eventos</h2>
              <span className="badge">{proximosEventos.length}</span>
            </div>

            {proximosEventos.length === 0 ? (
              <div className="empty-state">
                <p className="empty-icon">📭</p>
                <p className="empty-text">No tienes eventos próximos</p>
                <p className="empty-hint">Agrega exámenes o trabajos desde el menú</p>
              </div>
            ) : (
              <div className="events-grid">
                {proximosEventos.map((evento) => {
                  const esExamen = evento.hasOwnProperty('temas');
                  
                  return (
                    <EventCard
                      key={evento._id}
                      evento={evento}
                      tipo={esExamen ? 'examen' : 'trabajo'}
                      onDelete={esExamen ? handleDeleteExamen : handleDeleteTrabajo}
                      onEdit={esExamen ? handleEditExamen : handleEditTrabajo}
                    />
                  );
                })}
              </div>
            )}
          </section>

          <section className="resumen-section">
            <h2>📊 Resumen</h2>
            <div className="resumen-cards">
              <div className="resumen-card examenes">
                <div className="resumen-icon">📝</div>
                <div className="resumen-info">
                  <h3>{examenes.length}</h3>
                  <p>Exámenes</p>
                </div>
              </div>

              <div className="resumen-card trabajos">
                <div className="resumen-icon">📚</div>
                <div className="resumen-info">
                  <h3>{trabajos.length}</h3>
                  <p>Trabajos</p>
                </div>
              </div>

              <div className="resumen-card total">
                <div className="resumen-icon">📋</div>
                <div className="resumen-info">
                  <h3>{examenes.length + trabajos.length}</h3>
                  <p>Total</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default Home;