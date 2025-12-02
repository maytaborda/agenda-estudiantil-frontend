import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import './Pomodoro.css';

const Pomodoro = () => {
  const [tiempoEstudio, setTiempoEstudio] = useState(25); // minutos
  const [tiempoDescanso, setTiempoDescanso] = useState(5); // minutos
  const [tiempoRestante, setTiempoRestante] = useState(25 * 60); // segundos
  const [enEjecucion, setEnEjecucion] = useState(false);
  const [esDescanso, setEsDescanso] = useState(false);
  const [ciclosCompletados, setCiclosCompletados] = useState(0);
  const [mostrarConfig, setMostrarConfig] = useState(false);
  
  const intervaloRef = useRef(null);
  const audioRef = useRef(null);

  // Inicializar el audio de notificación
  useEffect(() => {
    audioRef.current = new Audio('data:audio/wav;base64,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');
  }, []);

  // Control del temporizador - CORREGIDO
  useEffect(() => {
    if (enEjecucion) {
      intervaloRef.current = setInterval(() => {
        setTiempoRestante(prev => {
          if (prev <= 1) {
            // Tiempo terminado
            clearInterval(intervaloRef.current);
            reproducirSonido();
            
            if (esDescanso) {
              // Termina el descanso
              setCiclosCompletados(c => c + 1);
              setEsDescanso(false);
              setEnEjecucion(false);
              return tiempoEstudio * 60;
            } else {
              // Termina estudio
              setEsDescanso(true);
              setEnEjecucion(false);
              return tiempoDescanso * 60;
            }
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervaloRef.current) {
        clearInterval(intervaloRef.current);
      }
    }

    return () => {
      if (intervaloRef.current) {
        clearInterval(intervaloRef.current);
      }
    };
  }, [enEjecucion, esDescanso, tiempoEstudio, tiempoDescanso]);

  const reproducirSonido = () => {
    if (audioRef.current) {
      audioRef.current.play().catch(e => console.log('Error al reproducir sonido:', e));
    }
  };

  const iniciarPausar = () => {
    setEnEjecucion(!enEjecucion);
  };

  const reiniciar = () => {
    setEnEjecucion(false);
    setEsDescanso(false);
    setTiempoRestante(tiempoEstudio * 60);
  };

  const aplicarConfiguracion = () => {
    setEnEjecucion(false);
    setEsDescanso(false);
    setTiempoRestante(tiempoEstudio * 60);
    setMostrarConfig(false);
  };

  const formatearTiempo = (segundos) => {
    const mins = Math.floor(segundos / 60);
    const segs = segundos % 60;
    return `${mins.toString().padStart(2, '0')}:${segs.toString().padStart(2, '0')}`;
  };

  const porcentaje = esDescanso 
    ? ((tiempoDescanso * 60 - tiempoRestante) / (tiempoDescanso * 60)) * 100
    : ((tiempoEstudio * 60 - tiempoRestante) / (tiempoEstudio * 60)) * 100;

  return (
    <>
      <Navbar />
      <div className="pomodoro-container">
        <div className="pomodoro-header">
          <h1>⏱️ Cronómetro Pomodoro</h1>
          <p>Técnica de estudio con intervalos de concentración y descanso</p>
        </div>

        <div className="pomodoro-content">
          <div className="timer-card">
            <div className="timer-status">
              <span className={`status-badge ${esDescanso ? 'descanso' : 'estudio'}`}>
                {esDescanso ? '☕ Descanso' : '📖 Tiempo de Estudio'}
              </span>
            </div>

            <div className="timer-display">
              <svg className="progress-ring" width="300" height="300">
                <circle
                  className="progress-ring-bg"
                  stroke="#E5E7EB"
                  strokeWidth="12"
                  fill="transparent"
                  r="140"
                  cx="150"
                  cy="150"
                />
                <circle
                  className="progress-ring-progress"
                  stroke={esDescanso ? "#10B981" : "#7C3AED"}
                  strokeWidth="12"
                  fill="transparent"
                  r="140"
                  cx="150"
                  cy="150"
                  style={{
                    strokeDasharray: `${2 * Math.PI * 140}`,
                    strokeDashoffset: `${2 * Math.PI * 140 * (1 - porcentaje / 100)}`,
                    transition: 'stroke-dashoffset 0.5s ease'
                  }}
                />
              </svg>
              <div className="timer-text">
                <span className="tiempo-numero">{formatearTiempo(tiempoRestante)}</span>
              </div>
            </div>

            <div className="timer-controls">
              <button 
                className={`btn-control ${enEjecucion ? 'pausar' : 'iniciar'}`}
                onClick={iniciarPausar}
              >
                {enEjecucion ? '⏸ Pausar' : '▶ Iniciar'}
              </button>
              <button 
                className="btn-control reiniciar"
                onClick={reiniciar}
              >
                🔄 Reiniciar
              </button>
              <button 
                className="btn-control config"
                onClick={() => setMostrarConfig(!mostrarConfig)}
              >
                ⚙️ Configurar
              </button>
            </div>

            <div className="ciclos-info">
              <p>🎯 Ciclos completados: <strong>{ciclosCompletados}</strong></p>
            </div>
          </div>

          {mostrarConfig && (
            <div className="config-card">
              <h2>⚙️ Configuración</h2>
              
              <div className="config-group">
                <label>Tiempo de Estudio (minutos)</label>
                <div className="input-with-buttons">
                  <button type="button" onClick={() => setTiempoEstudio(Math.max(1, tiempoEstudio - 5))}>-</button>
                  <input 
                    type="number" 
                    value={tiempoEstudio}
                    onChange={(e) => setTiempoEstudio(Math.max(1, parseInt(e.target.value) || 1))}
                    min="1"
                    max="120"
                  />
                  <button type="button" onClick={() => setTiempoEstudio(Math.min(120, tiempoEstudio + 5))}>+</button>
                </div>
              </div>

              <div className="config-group">
                <label>Tiempo de Descanso (minutos)</label>
                <div className="input-with-buttons">
                  <button type="button" onClick={() => setTiempoDescanso(Math.max(1, tiempoDescanso - 5))}>-</button>
                  <input 
                    type="number" 
                    value={tiempoDescanso}
                    onChange={(e) => setTiempoDescanso(Math.max(1, parseInt(e.target.value) || 1))}
                    min="1"
                    max="60"
                  />
                  <button type="button" onClick={() => setTiempoDescanso(Math.min(60, tiempoDescanso + 5))}>+</button>
                </div>
              </div>

              <button className="btn-aplicar" onClick={aplicarConfiguracion}>
                ✓ Aplicar Configuración
              </button>
            </div>
          )}

          <div className="info-card">
            <h3>💡 ¿Qué es la Técnica Pomodoro?</h3>
            <p>
              La técnica Pomodoro es un método de gestión del tiempo que utiliza intervalos 
              cronometrados para maximizar la concentración y productividad.
            </p>
            <ul>
              <li>📖 Estudia durante el tiempo configurado (por defecto 25 min)</li>
              <li>☕ Toma un descanso cuando suene la alarma (por defecto 5 min)</li>
              <li>🔄 Repite el ciclo cuantas veces necesites</li>
              <li>🎯 Después de 4 ciclos, toma un descanso más largo (15-30 min)</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Pomodoro;