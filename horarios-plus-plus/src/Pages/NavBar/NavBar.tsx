import React from "react"
import "./NavBar.css";

export default function NavBar() {
  return (
    <div className="navigation-bar">
      <div>
        <a href="/">HorariosPlusPlus</a>
      </div>
      <div>
        <a href="">Mi Horario</a>
        <a href="generation">Generar</a>
        <a href="">Eventos</a>
        <a href="">Materias</a>
        <a href="">Permisos</a>
      </div>
      <div>
        <a href="login">log</a>
        <a>sign</a>
        <a>|→</a>
      </div>
    </div>
  )
}