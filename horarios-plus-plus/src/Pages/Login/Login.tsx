import React from "react";
import NavBar from "../../CommonComponents/NavBar/NavBar.tsx";
import "./Login.css";

export default function Login() {
  return (
    <div className="flex-vertical vh100">
      <NavBar/>
      <div className="main-container">
        <div className="login-container flex-vertical ">
          <div className="title-white">
            Horarios Plus Plus
          </div>
          <div className="flex-horizontal flex-center">
            <input className="field" placeholder="Correo electronico" type="email" id="fname" name="fname"/>
          </div>
          <div className="flex-horizontal flex-center">
            <input className="field" placeholder="Contraseña" type="password" id="fname" name="fname"/>
          </div>
          <div className="flex-horizontal flex-center">
            <button className="login-button" type="button">Iniciar Sesion</button> 
          </div>
        </div>
      </div>
    </div>
  )
}