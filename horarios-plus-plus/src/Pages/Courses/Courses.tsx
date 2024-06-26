import "./Courses.css";

import React from "react";
import SplitLayout from "../../Layouts/Split/SplitLayout.tsx";

export default function Courses() {
  return (
    <SplitLayout>

      {/* LEFT */}
      <div className="left-container">
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
                <button type="button">Click Me!</button>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* RIGHT */}
      <div>
        <div className="flex-horizontal">

          <div>
            CALCULO INTEGRAL
          </div>

          <div className="flex-horizontal">
            <div>
              NRC:
            </div>
            <div>
              <input className="" placeholder="Busqueda" type="text" id="fname" name="fname" />
            </div>
          </div>
        </div>


        <div className="flex-horizontal">
          <div>
            Profesor:
          </div>
          <div>
            <input className="" placeholder="Name" type="text" id="fname" name="fname" value="armenia" />
          </div>
        </div>

        <div>
          <div className="flex-horizontal">
            <div>
              Sessiones
            </div>
            <div>
              <button type="button">Click Me!</button>
            </div>
          </div>

          <div>
            <div className="flex-horizontal">
              <div>
                <select name="days" id="days">
                  <option value="LUN">Lunes</option>
                  <option value="MAR">Martes</option>
                  <option value="MIE">Miercoles</option>
                  <option value="JUE">Jueves</option>
                  <option value="VIE">Viernes</option>
                  <option value="SAB">Sabado</option>
                  <option value="DOM">Domingo</option>
                </select>
              </div>
              <div className="flex-horizontal">
                <div>
                  <select name="firstHour" id="firstHour">
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                    <option value="10">10</option>
                    <option value="11">11</option>
                    <option value="12">12</option>
                    <option value="13">13</option>
                    <option value="14">14</option>
                    <option value="15">15</option>
                    <option value="16">16</option>
                    <option value="17">17</option>
                    <option value="18">18</option>
                  </select>
                </div>
                <div>
                  :
                </div>
                <div>
                  <select name="firstSecond" id="firstSecond">
                    <option value="0">00</option>
                    <option value="15">15</option>
                    <option value="30">30</option>
                    <option value="45">45</option>
                  </select>
                </div>
              </div>

              <div>
                -
              </div>

              <div className="flex-horizontal">
                <div>
                  <select name="secondHour" id="secondHour">
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                    <option value="10">10</option>
                    <option value="11">11</option>
                    <option value="12">12</option>
                    <option value="13">13</option>
                    <option value="14">14</option>
                    <option value="15">15</option>
                    <option value="16">16</option>
                    <option value="17">17</option>
                    <option value="18">18</option>
                  </select>
                </div>
                <div>
                  :
                </div>
                <div>
                  <select name="secondMinute" id="secondMinute">
                    <option value="0">00</option>
                    <option value="15">15</option>
                    <option value="30">30</option>
                    <option value="45">45</option>
                  </select>
                </div>
              </div>

              <div>
                <button type="button">Click Me!</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SplitLayout>
  )
}