import React from "react";
import NavBar from "../../CommonComponents/NavBar/NavBar.tsx";

import "./Landing.css";

export default function Landing() {
  return (
    <div>
      <NavBar />
      <div className="landing-container">
        <div className="over-hidden">
          <div className="flex-vertical title non-highlightable">
            <div> HorariosPlusPlus </div>
            <div>
              Planea<br />
              Genera<br />
              Visualiza<br />
            </div>
            <div className="relative-pos">
              tu horario
              <div className="spike-border" />
            </div>
          </div>
          <div className="relative-pos curve">
            <div className="emoji">📅</div>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -5 26 7"> <path d="M 0 0 C 2 -1 3 -1 5 -1 C 8 -1 9 0 12 0 C 15 0 16 -4 26 -5 L 26 2 L 0 2 L 0 0" /> </svg>
          </div>
        </div>
        <div className="title-container">
          <div className="title2">
            Comienza a gestionar <br />
            tus horarios hoy! <br />
          </div>
          <div className="sign-up-container">

            {/* ESTUDIANTE */}
            <div className="sign-up-box">
              <h1 className="text-center">Gestiona y planifica tu horario <br /><br /> </h1>
              <div>
                <ul className="text-list">
                  <li>Genera todos los horarios posibles</li><br />
                  <li>Visualiza tu horario actual</li><br />
                  <li>Cruza tu horario con eventos</li><br />
                </ul>
              </div>
              <div className="text-center sign-up-button">
                <a href="signup"> <button className="button1" type="button" >Crear Cuenta Estudiantil</button> </a>
              </div>
            </div>

            {/* PROFESOR */}
            <div className="sign-up-box">
              <h1 className="text-center">Gestiona todas tus materias y eventos</h1><br />
              <div>
                <ul className="text-list">
                  <li>Gestiona secciones</li> <br />
                  <li>Gestiona sesiones</li> <br />
                </ul>
              </div>
              <div className="text-center sign-up-button">
                <a href="signup"> <button className="button1" type="button" >Crear Cuenta Profesor</button> </a>
              </div>
            </div>

            {/* ORGANIZADOR */}
            <div className="sign-up-box">
              <h1 className="text-center">Gestiona los eventos que organices</h1><br />
              <div>
                <ul className="text-list">
                  <li>Gestiona eventos</li> <br />
                </ul>
              </div>
              <div className="text-center sign-up-button">
                <a href="signup"> <button className="button1" type="button" >Crear Cuenta Organizador</button> </a>
              </div>
            </div>
          </div>

          <div className="login-container text-center flex-vertical text-white">
            Ya tienes una cuenta? Inicia sesion aqui! <br />
            <a href="signup"> <button className="button3" type="button" >Iniciar sesion</button> </a>
          </div>

        </div>
        <div className="text-center dev-container">
          <h2>Elaborado por:</h2>
          <div className="flex-horizontal flex-center">

            <div className="flex-vertical  dev-box text">
              <div> Humberto Aleman </div>
              <div> <a href="https://github.com/Kimbix">GitHub</a> </div>
            </div>

            <div className="flex-vertical dev-box text">
              <div> Cristina Carnevali </div>
              <div> <a href="https://github.com/crisUni">GitHub</a> </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}