import { useState, useEffect } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const Certificados = () => {
  const [certificados, setCertificados] = useState([]);
  const [proyectos, setProyectos] = useState([]);
  const [show, setShow] = useState(false);
  const [filter, setFilter] = useState("");
  const [certificado, setCertificado] = useState({
    numeroCertificado: "",
    proyecto: "",
    fechaEmision: "",
    descripcion: "",
    estado: "Pendiente",
  });
  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchCertificados();
    fetchProyectos();
  }, []);

  const fetchCertificados = async () => {
    const response = await axios.get("http://localhost:5000/api/certificados");
    setCertificados(response.data);
  };

  const fetchProyectos = async () => {
    const response = await axios.get("http://localhost:5000/api/proyectos");
    setProyectos(response.data);
  };

  const handleShow = () => {
    setEditMode(false);
    setCertificado({ numeroCertificado: "", proyecto: "", fechaEmision: "", descripcion: "", estado: "Pendiente" });
    setShow(true);
  };

  const handleClose = () => setShow(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editMode) {
      await axios.put(`http://localhost:5000/api/certificados/${editingId}`, certificado);
    } else {
      await axios.post("http://localhost:5000/api/certificados", certificado);
    }
    fetchCertificados();
    handleClose();
  };

  const handleEdit = (cert) => {
    setEditMode(true);
    setEditingId(cert._id);
    setCertificado({
      numeroCertificado: cert.numeroCertificado,
      proyecto: cert.proyecto?._id || "",
      fechaEmision: cert.fechaEmision.split("T")[0],
      descripcion: cert.descripcion,
      estado: cert.estado,
    });
    setShow(true);
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/api/certificados/${id}`);
    fetchCertificados();
  };

  const filteredCertificados = certificados.filter(c =>
    (c.proyecto?.nombre?.toLowerCase() || "").includes(filter.toLowerCase()) ||
    c.numeroCertificado.toLowerCase().includes(filter.toLowerCase()) ||
    c.estado.toLowerCase().includes(filter.toLowerCase())
  );

  const columns = [
    { name: "Número", selector: row => row.numeroCertificado, sortable: true },
    { name: "Proyecto", selector: row => row.proyecto?.nombre || "Sin proyecto", sortable: true },
    { name: "Fecha de Emisión", selector: row => new Date(row.fechaEmision).toLocaleDateString(), sortable: true },
    { name: "Descripción", selector: row => row.descripcion },
    { name: "Estado", selector: row => row.estado, sortable: true },
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
        <h2>Gestión de Certificados</h2>
        <button className="btn btn-primary mb-3" onClick={handleShow}>Agregar Certificado</button>

        <input
          type="text"
          className="form-control mb-3"
          placeholder="Filtrar por Número, Proyecto o Estado..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />

        <DataTable
          columns={columns}
          data={filteredCertificados}
          pagination
          highlightOnHover
          striped
        />

        {show && (
          <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{editMode ? "Editar Certificado" : "Agregar Certificado"}</h5>
                  <button className="btn-close" onClick={handleClose}></button>
                </div>
                <div className="modal-body">
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label className="form-label">Número de Certificado</label>
                      <input type="text" className="form-control" value={certificado.numeroCertificado} onChange={(e) => setCertificado({ ...certificado, numeroCertificado: e.target.value })} required />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Proyecto</label>
                      <select className="form-select" value={certificado.proyecto} onChange={(e) => setCertificado({ ...certificado, proyecto: e.target.value })} required>
                        <option value="">Seleccione un proyecto</option>
                        {proyectos.map((p) => (
                          <option key={p._id} value={p._id}>{p.nombre}</option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Fecha de Emisión</label>
                      <input type="date" className="form-control" value={certificado.fechaEmision} onChange={(e) => setCertificado({ ...certificado, fechaEmision: e.target.value })} required />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Descripción</label>
                      <textarea className="form-control" value={certificado.descripcion} onChange={(e) => setCertificado({ ...certificado, descripcion: e.target.value })}></textarea>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Estado</label>
                      <select className="form-select" value={certificado.estado} onChange={(e) => setCertificado({ ...certificado, estado: e.target.value })}>
                        <option value="Pendiente">Pendiente</option>
                        <option value="Aprobado">Aprobado</option>
                        <option value="Rechazado">Rechazado</option>
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

export default Certificados;
