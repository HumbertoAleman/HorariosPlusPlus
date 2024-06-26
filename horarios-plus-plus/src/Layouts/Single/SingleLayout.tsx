import "./SingleLayout.css"

import React from "react"
import NavBar from "../../CommonComponents/NavBar/NavBar.tsx";


export default function SingleLayout({ children }) {
  return (
    <main>
      <div className="single-layout">
        <NavBar/>
        <div className="single-wrapped">
          { children }  
        </div>
      </div>
    </main>
  )
}