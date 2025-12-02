import React from 'react';
import './EventCard.css';

const EventCard = ({ evento, tipo, onDelete, onEdit }) => {
  //Normalizar fecha a medianoche local
  const fecha = new Date(evento.fecha);
  fecha.setMinutes(fecha.getMinutes() + fecha.getTimezoneOffset());

  const hoy = new Date();
  hoy.setHours(0,0,0,0);

  const fechaNormalizada = new Date(fecha);
  fechaNormalizada.setHours(0,0,0,0);
  
  const diferenciaDias = Math.ceil((fechaNormalizada - hoy) / (1000 * 60 * 60 * 24));
  
  const formatearFecha = (fecha) => {
    return fecha.toLocaleDateString('es-ES', { 
      day: '2-digit', 
      month: 'long', 
      year: 'numeric',
      timeZone: 'UTC'
    });
  };

  const getUrgencia = (dias) => {
    if (dias < 0) return 'vencido';
    if (dias === 0) return 'hoy';
    if (dias <= 3) return 'urgente';
    if (dias <= 7) return 'proximo';
    return 'normal';
  };

  const urgencia = getUrgencia(diferenciaDias);

  return (
    <div className={`event-card ${tipo} ${urgencia}`}>
      <div className="event-header">
        <span className="event-tipo">{tipo === 'examen' ? '📝 Examen' : '📚 Trabajo'}</span>
        <div className="event-actions">
          <button className="btn-edit" onClick={() => onEdit(evento)}>
            ✏️
          </button>
          <button className="btn-delete" onClick={() => onDelete(evento._id)}>
            🗑️
          </button>
        </div>
      </div>
      
      <h3 className="event-materia">{evento.materia}</h3>
      
      <div className="event-fecha">
        📅 {formatearFecha(fecha)}
      </div>

      <div className="event-dias">
        {diferenciaDias < 0 && `❌ Vencido hace ${Math.abs(diferenciaDias)} día${Math.abs(diferenciaDias) > 1 ? 's' : ''}`}
        {diferenciaDias === 0 && '⚠️ HOY'}
        {diferenciaDias > 0 && `⏰ En ${diferenciaDias} día${diferenciaDias > 1 ? 's' : ''}`}
      </div>
      
      <div className="event-descripcion">
        {tipo === 'examen' ? evento.temas : evento.descripcion}
      </div>
    </div>
  );
};

export default EventCard;