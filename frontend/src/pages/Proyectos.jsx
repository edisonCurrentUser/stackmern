import { useState, useEffect } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const Proyectos = () => {
  const [proyectos, setProyectos] = useState([]);
  const [contratistas, setContratistas] = useState([]);
  const [inspecciones, setInspecciones] = useState([]);
  const [show, setShow] = useState(false);
  const [proyecto, setProyecto] = useState({ nombre: "", ubicacion: "", fechaInicio: "", fechaFin: "", contratistas: [], inspecciones: [] });
  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchProyectos();
    fetchContratistas();
    fetchInspecciones();
  }, []);

  const fetchProyectos = async () => {
    const response = await axios.get("http://localhost:5000/api/proyectos");
    setProyectos(response.data);
  };

  const fetchContratistas = async () => {
    const response = await axios.get("http://localhost:5000/api/contratistas");
    setContratistas(response.data);
  };

  const fetchInspecciones = async () => {
    const response = await axios.get("http://localhost:5000/api/inspecciones");
    setInspecciones(response.data);
  };

  const handleShow = () => {
    setEditMode(false);
    setProyecto({ nombre: "", ubicacion: "", fechaInicio: "", fechaFin: "", contratistas: [], inspecciones: [] });
    setShow(true);
  };

  const handleClose = () => setShow(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editMode) {
      await axios.put(`http://localhost:5000/api/proyectos/${editingId}`, proyecto);
    } else {
      await axios.post("http://localhost:5000/api/proyectos", proyecto);
    }
    fetchProyectos();
    handleClose();
  };

  const handleEdit = (proyecto) => {
    setEditMode(true);
    setEditingId(proyecto._id);
    setProyecto({ nombre: proyecto.nombre, ubicacion: proyecto.ubicacion, fechaInicio: proyecto.fechaInicio, fechaFin: proyecto.fechaFin || "", contratistas: proyecto.contratistas || [], inspecciones: proyecto.inspecciones || [] });
    setShow(true);
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/api/proyectos/${id}`);
    fetchProyectos();
  };

  // Definir las columnas para React Data Table
  const columns = [
    { name: "Nombre", selector: row => row.nombre, sortable: true },
    { name: "Ubicación", selector: row => row.ubicacion, sortable: true },
    { name: "Fecha de Inicio", selector: row => new Date(row.fechaInicio).toLocaleDateString(), sortable: true },
    { name: "Fecha de Fin", selector: row => row.fechaFin ? new Date(row.fechaFin).toLocaleDateString() : "N/A", sortable: true },
    { name: "Contratistas", selector: row => row.contratistas.map(c => c.nombre).join(", ") },
    { name: "Inspecciones", selector: row => row.inspecciones.map(i => `${i.inspector} - ${new Date(i.fecha).toLocaleDateString()}`).join(", ") },
    {
      name: "Acciones",
      cell: row => (
        <div>
          <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(row)}>Editar</button>
          <button className="btn btn-danger btn-sm" onClick={() => handleDelete(row._id)}>Eliminar</button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true
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
        <h2>Gestión de Proyectos</h2>
        <button className="btn btn-primary" onClick={handleShow}>Agregar Proyecto</button>

        {/* Implementación de DataTable */}
        <DataTable
          columns={columns}
          data={proyectos}
          pagination
          highlightOnHover
          striped
        />

        {show && (
          <div className="modal fade show d-block" style={{ background: "rgba(0,0,0,0.5)" }} tabIndex="-1">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{editMode ? "Editar Proyecto" : "Agregar Proyecto"}</h5>
                  <button type="button" className="btn-close" onClick={handleClose}></button>
                </div>
                <div className="modal-body">
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label className="form-label">Nombre</label>
                      <input type="text" className="form-control" value={proyecto.nombre} onChange={(e) => setProyecto({ ...proyecto, nombre: e.target.value })} required />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Ubicación</label>
                      <input type="text" className="form-control" value={proyecto.ubicacion} onChange={(e) => setProyecto({ ...proyecto, ubicacion: e.target.value })} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Fecha de Inicio</label>
                      <input type="date" className="form-control" value={proyecto.fechaInicio} onChange={(e) => setProyecto({ ...proyecto, fechaInicio: e.target.value })} required />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Fecha de Fin</label>
                      <input type="date" className="form-control" value={proyecto.fechaFin} onChange={(e) => setProyecto({ ...proyecto, fechaFin: e.target.value })} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Contratistas</label>
                      <select multiple className="form-select" value={proyecto.contratistas} onChange={(e) => setProyecto({ ...proyecto, contratistas: [...e.target.selectedOptions].map(o => o.value) })}>
                        {contratistas.map(c => <option key={c._id} value={c._id}>{c.nombre}</option>)}
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Inspecciones</label>
                      <select multiple className="form-select" value={proyecto.inspecciones} onChange={(e) => setProyecto({ ...proyecto, inspecciones: [...e.target.selectedOptions].map(o => o.value) })}>
                        {inspecciones.map(i => <option key={i._id} value={i._id}>{i.inspector} - {new Date(i.fecha).toLocaleDateString()}</option>)}
                      </select>
                    </div>
                    <button type="submit" className="btn btn-primary">{editMode ? "Actualizar" : "Guardar"}</button>
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

export default Proyectos;
