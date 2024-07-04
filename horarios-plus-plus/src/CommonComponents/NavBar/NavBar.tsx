import React from "react"
import "./NavBar.css";
import Login from "../../Pages/Login/Login";

export default function NavBar() {
  const isUserStudent = sessionStorage.getItem("activePermissionLevel") === "estudiante"
  const isUserTeacher = sessionStorage.getItem("activePermissionLevel") === "profesor"
  const isUserOrganizer = sessionStorage.getItem("activePermissionLevel") === "organizador"
  const isUserAdmin = sessionStorage.getItem("activePermissionLevel") === "administrador"
  const isUserLogedIn = sessionStorage.getItem("activeEmail") !== "null" && sessionStorage.getItem("activeEmail") !== null

  const logOut = () => {
    sessionStorage.setItem("activePermissionLevel", "null")
    sessionStorage.setItem("activeEmail", "null")
    sessionStorage.setItem("activeCedula", "null")
    window.location.href = "/"
  }

  return (
    <div className="navigation-bar">
      <div>
        <a href="/">HorariosPlusPlus</a>
      </div>
      <div>
        {
          isUserStudent || isUserAdmin
            ? <>
              <a href="schedule">Mi Horario</a>
              <a href="generation">Generar</a>
              <a href="intersection">Cruze</a>
            </>
            : <></>
        }

        {
          isUserOrganizer || isUserOrganizer
            ? <a href="events">Eventos</a>
            : <></>
        }

        {
          isUserTeacher || isUserAdmin
            ? <a href="courses">Materias</a>
            : <></>
        }

        {
          isUserAdmin
            ? <a href="permissions">Permisos</a>
            : <></>
        }
      </div>
      <div>
        {
          !isUserLogedIn
            ? <>
              <a href="login">Iniciar Sesion</a>
              <a href="signup">Crear Cuenta</a>
            </>
            : <a onClick={_ => logOut()} >|→</a>
        }
      </div>
    </div>
  )
}