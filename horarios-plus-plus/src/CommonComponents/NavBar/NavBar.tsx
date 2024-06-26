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
        <a href="">Eventos</a>
        <a href="courses">Materias</a>
        <a href="">Permisos</a>
        <a href="">Cruze</a>

      </div>
      <div>
        <a href="login">Iniciar Sesion</a>
        <a href="signup">Crear Cuenta</a>
        <a>|→</a>
      </div>
    </div>
  )
}