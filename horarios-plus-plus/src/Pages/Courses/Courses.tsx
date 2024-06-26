import React from "react";
import NavBar from "../../CommonComponents/NavBar/NavBar.tsx";

import "./Courses.css";

export default function Courses() {
  return (
    <div className="flex-vertical vh100">
      <NavBar />
      <div className="split-view flex-horizontal">

        {/* LEFT */}
        <div className="left-container">
          <div className="search-container">
            <input className="search-field" placeholder="Busqueda" type="text" id="fname" name="fname"/>
          </div>
          <div>
            <div className="course-name">
              Calculo Integral
            </div>
            <div className="sections-list flex-vertical">
              <div className="section flex-horizontal">
                <div>
                  NRC: pene
                </div>
                <div>
                  <input type="checkbox" id="vehicle1" name="vehicle1" value="Bike" /> 
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="right-container">
          <div className="right-background">


          </div>
        </div>
      </div>
    </div>
  )
}