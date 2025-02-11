import { Link } from "react-router-dom";

function PaginaPrincipal() {
  return (
    <div>
      {/* Navbar */}
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

      {/* Contenido principal */}
      <div className="container-fluid text-center" style={{ minHeight: "80vh", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <h1 className="display-4">Bienvenido al Sistema de Gestión</h1>
        <p className="lead">Selecciona una opción en el menú para empezar.</p>
      </div>
    </div>
  );
}

export default PaginaPrincipal;
