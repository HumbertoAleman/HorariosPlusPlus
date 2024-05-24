import React from "react";
import NavBar from "./NavBar.tsx";

import tagline_bg from "../resources/images/tagline_bg.png"

import "./Landing.css";

export default function Landing() {
  return (
    <div>
      <div>
        {/* Art Container */}
        <div className="relative-pos vh75">
          <img src={tagline_bg} style={{ position: "absolute", top: "0", height: "100%", width: "100%" }}/>
        </div>
        
        {/* Description Container */}
        <div className="background-dark flex-vertical vh75">
          <div className="flex-vertical flex-center signup-wrapper">
            <h1>Comienza a controlar tu horario hoy!</h1>
            <button type="button">Crear una Cuenta</button>
          </div>
          <div className="flex-vertical flex-center login-wrapper">
            <p>Ya tienes una cuenta? Inicia secion</p>
            <button type="button">Iniciar Sesion</button>
          </div>
        </div>
        <div className="background-dark">
          <h2>Elaborado por:</h2>
        </div>
        {/* Developers Container */}
        <div className="background-dark flex-horizontal">
          <div className="developer-box">
            <h3>Humberto Aleman</h3>
            <p>Frontend, Backend</p>
            <a href="https://github.com/HumbertoAlemanOdreman">github</a>
          </div>
          <div className="developer-box">
            <h3>Cristina Carnevali</h3>
            <p>UI, UX, Frontend</p>
            <a href="https://github.com/crisUni">github</a>
          </div>
        </div>

      </div>
    </div>
  )
}