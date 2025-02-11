import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const Contratistas = () => {
  const [contratistas, setContratistas] = useState([]);
  const [filteredContratistas, setFilteredContratistas] = useState([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [nuevoContratista, setNuevoContratista] = useState({
    nombre: '', empresa: '', especialidad: '', telefono: '', correo: ''
  });

  useEffect(() => {
    axios.get('http://localhost:5000/api/contratistas')
      .then(response => {
        setContratistas(response.data);
        setFilteredContratistas(response.data);
      })
      .catch(error => console.error(error));
  }, []);

  useEffect(() => {
    const resultado = contratistas.filter(contratista =>
      contratista.nombre.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredContratistas(resultado);
  }, [search, contratistas]);

  const handleChange = (e) => {
    setNuevoContratista({ ...nuevoContratista, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editMode) {
      axios.put(`http://localhost:5000/api/contratistas/${selectedId}`, nuevoContratista)
        .then(response => {
          setContratistas(contratistas.map(item => (item._id === selectedId ? response.data : item)));
          resetForm();
        })
        .catch(error => console.error(error));
    } else {
      axios.post('http://localhost:5000/api/contratistas', nuevoContratista)
        .then(response => {
          setContratistas([...contratistas, response.data]);
          resetForm();
        })
        .catch(error => console.error(error));
    }
  };

  const resetForm = () => {
    setShowModal(false);
    setEditMode(false);
    setNuevoContratista({ nombre: '', empresa: '', especialidad: '', telefono: '', correo: '' });
  };

  const handleEdit = (contratista) => {
    setNuevoContratista(contratista);
    setSelectedId(contratista._id);
    setEditMode(true);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    axios.delete(`http://localhost:5000/api/contratistas/${id}`)
      .then(() => setContratistas(contratistas.filter(item => item._id !== id)))
      .catch(error => console.error(error));
  };

  const columns = [
    { name: "Nombre", selector: row => row.nombre, sortable: true },
    { name: "Empresa", selector: row => row.empresa, sortable: true },
    { name: "Especialidad", selector: row => row.especialidad, sortable: true },
    { name: "Teléfono", selector: row => row.telefono, sortable: true },
    { name: "Correo", selector: row => row.correo, sortable: true },
    {
      name: "Acciones",
      cell: row => (
        <>
          <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(row)}>Editar</button>
          <button className="btn btn-danger btn-sm" onClick={() => handleDelete(row._id)}>Eliminar</button>
        </>
      )
    }
  ];

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark py-2">
        <div className="container">
          <Link className="navbar-brand" to="/">Gestión de Certificados</Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/proyectos">Proyectos</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/contratistas">Contratistas</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/inspecciones">Inspecciones</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/certificados">Certificados</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <div className="container mt-4">
        <h2>Lista de Contratistas</h2>
        <button className="btn btn-primary mb-3" onClick={() => { setShowModal(true); setEditMode(false); }}>Agregar Contratista</button>
        
        {/* Input de búsqueda */}
        <input
          type="text"
          className="form-control mb-3"
          placeholder="Buscar por nombre..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <DataTable
          columns={columns}
          data={filteredContratistas}
          pagination
          highlightOnHover
          responsive
        />

        {showModal && (
          <div className="modal show d-block" style={{ background: "rgba(0,0,0,0.5)" }} tabIndex="-1">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{editMode ? 'Editar Contratista' : 'Agregar Contratista'}</h5>
                  <button type="button" className="btn-close" onClick={resetForm}></button>
                </div>
                <div className="modal-body">
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label className="form-label">Nombre</label>
                      <input type="text" className="form-control" name="nombre" value={nuevoContratista.nombre} onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Empresa</label>
                      <input type="text" className="form-control" name="empresa" value={nuevoContratista.empresa} onChange={handleChange} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Especialidad</label>
                      <input type="text" className="form-control" name="especialidad" value={nuevoContratista.especialidad} onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Teléfono</label>
                      <input type="text" className="form-control" name="telefono" value={nuevoContratista.telefono} onChange={handleChange} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Correo</label>
                      <input type="email" className="form-control" name="correo" value={nuevoContratista.correo} onChange={handleChange} required />
                    </div>
                    <button type="submit" className="btn btn-primary">{editMode ? 'Actualizar' : 'Guardar'}</button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Contratistas;
