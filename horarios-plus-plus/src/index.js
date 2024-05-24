import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals.js';

import LandingInterface from './Pages/Landing.tsx';

import { BrowserRouter, Route, Routes } from 'react-router-dom';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route index element={<LandingInterface/>}/>
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

