import { useState, useEffect } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const Inspecciones = () => {
  const [inspecciones, setInspecciones] = useState([]);
  const [proyectos, setProyectos] = useState([]);
  const [show, setShow] = useState(false);
  const [filter, setFilter] = useState("");
  const [inspeccion, setInspeccion] = useState({ proyecto: "", fecha: "", inspector: "", observaciones: "", estado: "Pendiente" });
  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchInspecciones();
    fetchProyectos();
  }, []);

  const fetchInspecciones = async () => {
    const response = await axios.get("http://localhost:5000/api/inspecciones");
    setInspecciones(response.data);
  };

  const fetchProyectos = async () => {
    const response = await axios.get("http://localhost:5000/api/proyectos");
    setProyectos(response.data);
  };

  const handleShow = () => {
    setEditMode(false);
    setInspeccion({ proyecto: "", fecha: "", inspector: "", observaciones: "", estado: "Pendiente" });
    setShow(true);
  };

  const handleClose = () => setShow(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editMode) {
      await axios.put(`http://localhost:5000/api/inspecciones/${editingId}`, inspeccion);
    } else {
      await axios.post("http://localhost:5000/api/inspecciones", inspeccion);
    }
    fetchInspecciones();
    handleClose();
  };

  const handleEdit = (inspeccion) => {
    setEditMode(true);
    setEditingId(inspeccion._id);
    setInspeccion({
      proyecto: inspeccion.proyecto._id,
      fecha: inspeccion.fecha ? new Date(inspeccion.fecha).toISOString().split("T")[0] : "",
      inspector: inspeccion.inspector,
      observaciones: inspeccion.observaciones,
      estado: inspeccion.estado
    });
    setShow(true);
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/api/inspecciones/${id}`);
    fetchInspecciones();
  };

  const filteredInspecciones = inspecciones.filter(i =>
    (i.proyecto?.nombre?.toLowerCase() || "").includes(filter.toLowerCase()) ||
    i.inspector.toLowerCase().includes(filter.toLowerCase()) ||
    i.estado.toLowerCase().includes(filter.toLowerCase())
  );

  const columns = [
    { name: "Proyecto", selector: row => row.proyecto?.nombre || "Sin proyecto", sortable: true },
    { name: "Fecha", selector: row => new Date(row.fecha).toLocaleDateString(), sortable: true },
    { name: "Inspector", selector: row => row.inspector, sortable: true },
    { name: "Estado", selector: row => row.estado, sortable: true },
    { name: "Observaciones", selector: row => row.observaciones },
    {
      name: "Acciones",
      cell: row => (
        <>
          <button className="btn btn-warning btn-sm" onClick={() => handleEdit(row)}>Editar</button>
          <button className="btn btn-danger btn-sm ms-2" onClick={() => handleDelete(row._id)}>Eliminar</button>
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
        <h2>Gestión de Inspecciones</h2>
        <button className="btn btn-primary mb-3" onClick={handleShow}>Agregar Inspección</button>

        <input
          type="text"
          className="form-control mb-3"
          placeholder="Filtrar por Proyecto, Inspector o Estado..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />

        <DataTable
          columns={columns}
          data={filteredInspecciones}
          pagination
          highlightOnHover
          striped
        />

        {show && (
          <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{editMode ? "Editar Inspección" : "Agregar Inspección"}</h5>
                  <button className="btn-close" onClick={handleClose}></button>
                </div>
                <div className="modal-body">
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label className="form-label">Proyecto</label>
                      <select className="form-select" value={inspeccion.proyecto} onChange={(e) => setInspeccion({ ...inspeccion, proyecto: e.target.value })} required>
                        <option value="">Seleccione un proyecto</option>
                        {proyectos.map((p) => (
                          <option key={p._id} value={p._id}>{p.nombre}</option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Fecha</label>
                      <input type="date" className="form-control" value={inspeccion.fecha} onChange={(e) => setInspeccion({ ...inspeccion, fecha: e.target.value })} required />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Inspector</label>
                      <input type="text" className="form-control" value={inspeccion.inspector} onChange={(e) => setInspeccion({ ...inspeccion, inspector: e.target.value })} required />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Observaciones</label>
                      <textarea className="form-control" value={inspeccion.observaciones} onChange={(e) => setInspeccion({ ...inspeccion, observaciones: e.target.value })}></textarea>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Estado</label>
                      <select className="form-select" value={inspeccion.estado} onChange={(e) => setInspeccion({ ...inspeccion, estado: e.target.value })}>
                        <option value="Pendiente">Pendiente</option>
                        <option value="Aprobada">Aprobada</option>
                        <option value="Rechazada">Rechazada</option>
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

export default Inspecciones;
