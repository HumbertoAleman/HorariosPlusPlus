import "./Generation.css";

import React from "react";
import SplitLayout from "../../Layouts/Split/SplitLayout.tsx";

export default function Generation() {
  return (
    <SplitLayout>
      {/* LEFT */}
      <div>
        <div className="search-container">
          <input className="search-field" placeholder="Busqueda" type="text" id="fname" name="fname" />
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
      <div>

        {/* DAY BUTTONS */}
        <div className="day-container flex-horizontal flex-center">
          <button className="day-button" type="button">LUN</button>
          <button className="day-button" type="button">MAR</button>
          <button className="day-button" type="button">MIE</button>
          <button className="day-button" type="button">JUE</button>
          <button className="day-button" type="button">VIE</button>
          <button className="day-button" type="button">SAB</button>
          <button className="day-button" type="button">DOM</button>
        </div>

        {/* SCHEDULES */}
        <div>
        </div>

        {/* NAV BOTTOM */}
        <div className="nav-container flex-horizontal flex-center">
          <div>
            <button className="nav-button" type="button"> &lt; &lt; </button>
            <button className="nav-button" type="button"> &lt;</button>
          </div>
          <button className="nav-button save-button" type="button">GUARDAR</button>
          <div>
            <button className="nav-button" type="button">&gt; </button>
            <button className="nav-button" type="button">&gt; &gt;</button>
          </div>
        </div>
      </div>
    </SplitLayout>
  )
}