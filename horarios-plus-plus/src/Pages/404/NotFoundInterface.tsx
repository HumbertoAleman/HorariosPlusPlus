import React from "react";
import NavBar from "../../CommonComponents/NavBar/NavBar.tsx";

import svg from "../../resources/images/404.svg"

import "./NotFoundStyle.css";

export default function NotFoundInterface() {
  return (
    <div className="flex-vertical vh100">
      <NavBar />
      <div className="flex-vertical main-container">
        <div className="flex-center flex-vertical">
          <div className="main-title">
            404
          </div>
          <div className="t2-title flex-center flex-vertical">
            <div>
              La pagina a la que esta tratando de ir
            </div>
            <div>
              no pudo ser encontrada
            </div>
          </div>
        </div>

        <div>
          <img style={{ position: "absolute", bottom: "0", left: "0", width: "100vw"}} src={svg} alt="IMAGE NOT FOUND" />
        </div>
      </div>
    </div>
  )
}