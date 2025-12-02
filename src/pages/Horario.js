import React, {useState, useEffect} from 'react';
import Navbar from '../components/Navbar';
import {getHorarios, createHorario, deleteHorario} from '../services/api';
import './Horario.css';

const Horario = () =>{
    const [horarios, setHorarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState (false);
    const [formData, setFormData] = useState({
        dia: '',
        horaInicio: '',
        horaFin: '',
        materia: ''
    });
    const [error,setError] = useState('');
    const [submitting, setSubmitting]= useState(false);

    const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

    useEffect(()=>{
        cargarHorarios();
    },[]);

    const cargarHorarios = async () =>{
        try{
            const response = await getHorarios();
            setHorarios(response.data);
            setLoading(false);
        }catch(error){
            console.error('Error al cargar horarios:', error);
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]:e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.dia || !formData.horaInicio || !formData.horaFin || !formData.materia) {
            setError('Todos los campos son obligatorios');
            return;
        }

         // Validar que la hora de fin sea mayor que la de inicio
        if (formData.horaInicio >= formData.horaFin) {
            setError('La hora de fin debe ser mayor que la hora de inicio');
            return;
        }
        setSubmitting(true);

        try{
            const response = await createHorario(formData);
            setHorarios([...horarios, response.data.horario]);
            setFormData({dia: '', horaInicio: '', horaFin: '', materia: ''});
            setShowForm(false);
            setError('')
        }catch(error){
            setError(error.response?.data?.message || 'Error al crear horario');
        }finally{
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) =>{
        if(window.confirm('¿Estas seguro de eliminar esta clase?')){
            try{
                await deleteHorario(id);
                setHorarios(horarios.filter(h =>h._id !== id));
            }catch(error){
                console.error('Error al eliminar horario:', error);
                alert('Error al eliminar horario');
            }
        }
    };

    const getClasesPorDia = (dia) =>{
        return horarios
            .filter(h => h.dia === dia)
            .sort((a,b) =>a.horaInicio.localeCompare(b.horaInicio));
    };

    if (loading){
        return (
            <>
                <Navbar />
                <div className='loading-container'>
                    <h2>Cargando horario...</h2>
                </div>
            </>
        );
    }

    return(
        <>
            <Navbar />
            <div className='horario-container'>
                <div className='horario-header'>
                    <div>
                        <h1>📅 Planificación Semanal</h1>
                        <p>Organiza tu horario de clases</p>
                    </div>
                    <button className='btn-add' onClick={()=>setShowForm(!showForm)}>
                        {showForm ? 'Cancelar' : 'Agregar Clase'}
                    </button>
                </div>

                {showForm && (
                    <div className='form-card'>
                        <h2>Nueva clase</h2>
                        <form onSubmit={handleSubmit}>
                            <div className='form-row'>
                                <div className='form-group'>
                                    <label>Día</label>
                                    <select 
                                    name='dia'
                                    value={formData.dia}
                                    onChange={handleChange}>
                                        <option value="">Selecciona un día</option>
                                        {dias.map(dia =>(
                                            <option key={dia} value={dia}>
                                                {dia}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className='form-group'>
                                    <label>Materia</label>
                                    <input 
                                    type='text'
                                    name='materia'
                                    value={formData.materia}
                                    onChange={handleChange}
                                    placeholder='Ej. Matematica'
                                    />
                                </div>
                            </div>

                            <div className='form-row'>
                                <div className='form-group'>
                                    <label>Hora de inicio</label>
                                    <input
                                    type='time'
                                    name='horaInicio'
                                    value={formData.horaInicio}
                                    onChange={handleChange}
                                    />
                                </div>

                                <div className='form-group'>
                                    <label>Hora de fin</label>
                                    <input
                                    type='time'
                                    name='horaFin'
                                    value={formData.horaFin}
                                    onChange={handleChange}
                                    />
                                </div>
                            </div>

                            {error && <div className='error-message'>{error}</div>}

                            <button type='submit' className='btn-submit' disabled={submitting}>
                                {submitting ? 'Guardando...' : 'Guardar clase'}
                            </button>
                        </form>
                    </div>
                )}

                <div className='horario-content'>
                    <div className='horario-grid'>
                        {dias.map(dia =>{
                            const clases = getClasesPorDia(dia);
                            return (
                                <div key={dia} className='dia-card'>
                                    <div className='dia-header'>
                                        <h3>{dia}</h3>
                                        <span className='badge-dia'>{clases.length}</span>
                                    </div>

                                    <div className='clases-list'>
                                        {clases.length ===0 ?(
                                            <p className='sin-clases'>Sin clases</p>
                                        ):(
                                             clases.map(clase => (
                        <div key={clase._id} className="clase-item">
                          <div className="clase-info">
                            <div className="clase-materia">{clase.materia}</div>
                            <div className="clase-horario">
                              🕐 {clase.horaInicio} - {clase.horaFin}
                            </div>
                          </div>
                          <button 
                            className="btn-delete-small"
                            onClick={() => handleDelete(clase._id)}
                          >
                            🗑️
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default Horario;