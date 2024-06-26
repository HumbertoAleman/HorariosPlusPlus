import React from "react"
import "./NavBar.css";

export default function NavBar() {
  return (
    <div className="navigation-bar">
      <div>
        <a href="/">HorariosPlusPlus</a>
      </div>
      <div>
        <a href="schedule">Mi Horario</a>
        <a href="generation">Generar</a>
        <a href="events">Eventos</a>
        <a href="courses">Materias</a>
        <a href="permissions">Permisos</a>
        <a href="intersection">Cruze</a>

      </div>
      <div>
        <a href="login">Iniciar Sesion</a>
        <a href="signup">Crear Cuenta</a>
        <a>|→</a>
      </div>
    </div>
  )
}