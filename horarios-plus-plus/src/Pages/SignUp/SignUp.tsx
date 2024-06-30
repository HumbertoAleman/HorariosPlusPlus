import "./SignUp.css";

import React from "react";
import SingleLayout from "../../Layouts/Single/SingleLayout.tsx";
import IUser from "../../CommonComponents/Interfaces/IUser.ts";
import { newUser } from "../../API_Functions/users.ts";

export default function SignUp() {
  const [userToCreate, setUserToCreate] = React.useState<(IUser)>({ email: "", cedula: "", password: "", permissionLevel: "" });

  const handleUserChange = (newData: IUser) => {
    setUserToCreate(newData)
  } 

  const handleButtonPress = () => {
    newUser(userToCreate)
      .then(res => {
        if ("code" in res)
          return
        
        window.location.href = "/"
      })
  }

  return (
    <SingleLayout>
      <div className="main-container">
        <div className="login-container flex-vertical">
          <div className="title-white">
            Horarios Plus Plus
          </div>
          <div className="flex-horizontal flex-center">
            <input onChange={ev => handleUserChange({ ...userToCreate, cedula: ev.currentTarget.value })} value={userToCreate.cedula} className="field" placeholder="Cedula" type="text" id="fname" name="fname" />
          </div>
          <div className="flex-horizontal flex-center">
            <input onChange={ev => handleUserChange({ ...userToCreate, email: ev.currentTarget.value })} value={userToCreate.email} className="field" placeholder="Correo electronico" type="email" id="fname" name="fname" />
          </div>
          <select onChange={ev => handleUserChange({ ...userToCreate, permissionLevel: ev.currentTarget.value as "" | "estudiante" | "profesor" | "organizador" | "administrador" })} value={userToCreate.permissionLevel} className="account-type-dropdown" name="Tipo de cuenta" id="cuenta">
            <option value="">Seleccione Una Opcion...</option>
            <option value="estudiante">Estudiante</option>
            <option value="profesor">Profesor</option>
            <option value="organizador">Organizador</option>
            <option value="administrador">Administrador</option>
          </select>
          <div className="flex-horizontal flex-center">
            <input onChange={ev => handleUserChange({ ...userToCreate, password: ev.currentTarget.value })} value={userToCreate.password} className="field" placeholder="Contraseña" type="password" id="fname" name="fname" />
          </div>
          <div className="flex-horizontal flex-center">
            <button onClick={() => handleButtonPress()} className="signup-button" type="button">Crear Cuenta</button>
          </div>
        </div>
      </div>
    </SingleLayout>
  )
}