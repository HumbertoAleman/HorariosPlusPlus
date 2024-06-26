import "./SignUp.css";

import React from "react";
import SingleLayout from "../../Layouts/Single/SingleLayout.tsx";

export default function SignUp() {
  return (
    <SingleLayout>
      <div className="main-container">
        <div className="login-container flex-vertical">
          <div className="title-white">
            Horarios Plus Plus
          </div>
          <div className="flex-horizontal flex-center">
            <input className="field" placeholder="Nombre completo" type="text" id="fname" name="fname" />
          </div>
          <div className="flex-horizontal flex-center">
            <input className="field" placeholder="Cedula" type="text" id="fname" name="fname" />
          </div>
          <div className="flex-horizontal flex-center">
            <input className="field" placeholder="Correo electronico" type="email" id="fname" name="fname" />
          </div>
          <select className="account-type-dropdown" name="Tipo de cuenta" id="cuenta">
            <option value="Estudiante">Estudiante</option>
            <option value="Profesor">Profesor</option>
            <option value="Administrador">Administrador</option>
          </select>
          <div className="flex-horizontal flex-center">
            <input className="field" placeholder="Contraseña" type="password" id="fname" name="fname" />
          </div>
          <div className="flex-horizontal flex-center">
            <input className="field" placeholder="Contraseña" type="password" id="fname" name="fname" />
          </div>
          <div className="flex-horizontal flex-center">
            <button className="signup-button" type="button">Crear Cuenta</button>
          </div>
        </div>
      </div>
    </SingleLayout>
  )
}