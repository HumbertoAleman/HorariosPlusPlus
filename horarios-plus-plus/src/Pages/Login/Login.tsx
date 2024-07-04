import "./Login.css";

import React from "react";
import SingleLayout from "../../Layouts/Single/SingleLayout.tsx";
import { getUserByEmail } from "../../API_Functions/users.ts";

export default function Login() {
  const [loginData, setLoginData] = React.useState<{ email: string, password: string }>({ email: "", password: ""})

  const handleFieldChange = (newData) => {
    setLoginData(newData)
  }

  const handleLogin = () => {
    getUserByEmail(loginData.email)
    .then(res => {
      if ("code" in res)
        return

      if ("password" in res && loginData.password === res.password) {
        sessionStorage.setItem("activeEmail", res.email)
        sessionStorage.setItem("activeCedula", res.cedula)
        sessionStorage.setItem("activePermissionLevel", res.permissionLevel)
        window.location.href = "/"
      }
    })
  }

  return (
    <SingleLayout>
      <div className="main-container">
        <div className="login-container flex-vertical ">
          <div className="title-white-login">
            Horarios Plus Plus
          </div>
          <div className="flex-horizontal flex-center">
            <input onChange={ev => handleFieldChange({ ...loginData, email: ev.currentTarget.value })} value={loginData.email} className="field" placeholder="Correo electronico" type="email" id="fname" name="fname" />
          </div>
          <div className="flex-horizontal flex-center">
            <input onChange={ev => handleFieldChange({ ...loginData, password: ev.currentTarget.value })} value={loginData.password} className="field" placeholder="Contraseña" type="password" id="fname" name="fname" />
          </div>
          <div className="flex-horizontal flex-center">
            <button onClick={() => handleLogin()} className="login-button" type="button">Iniciar Sesion</button>
          </div>
        </div>
      </div>
    </SingleLayout>
  )
}