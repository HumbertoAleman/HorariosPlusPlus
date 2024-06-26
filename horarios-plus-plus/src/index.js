import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals.js';

import LandingInterface from './Pages/Landing/Landing.tsx';
import GenerationInterface from './Pages/Generation/Generation.tsx';
import CoursesInterface from './Pages/Courses/Courses.tsx';
import LoginInterface from './Pages/Login/Login.tsx';
import SignUpInterface from './Pages/SignUp/SignUp.tsx';
import MySchedule from "./Pages/MySchedule/MySchedule.tsx"
import NotFoundInterface from "./Pages/404/NotFoundInterface.tsx"
import Event from './Pages/Events/Events.tsx';
import Permissions from './Pages/Permissions/Permissions.tsx';
import Intersection from './Pages/Intersection/Intersection.tsx';

import { BrowserRouter, Route, Routes } from 'react-router-dom';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route index element={<LandingInterface/>}/>
          <Route path="schedule" element={<MySchedule/>}/>
          <Route path="generation" element={<GenerationInterface/>}/>
          <Route path="courses" element={<CoursesInterface/>}/>
          <Route path="login" element={<LoginInterface/>}/>
          <Route path="signup" element={<SignUpInterface/>}/>
          <Route path="events" element={<Event/>}/>
          <Route path="permissions" element={<Permissions/>}/>
          <Route path="intersection" element={<Intersection/>}/>
          <Route path="404" element={<NotFoundInterface/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

//         <Route path="generation" element={<GenerationInterface/>}/>

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App/>);

window.addEventListener("beforeunload", (event) => {
  // Tu código aquí
  console.log("El usuario está cerrando la página");
  // Si deseas mostrar un mensaje de confirmación antes de cerrar, descomenta la siguiente línea:
  // event.returnValue = '¿Estás seguro de que quieres salir?';
});

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

