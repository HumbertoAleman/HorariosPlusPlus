import "./SplitLayout.css"

import React from "react"
import NavBar from "../../CommonComponents/NavBar/NavBar.tsx";

export default function SplitLayout({ children }) {
  return (
    <main>
      <div className="split-layout">
        <NavBar/>
        <div className="split-wrapped">
          { children }  
        </div>
      </div>
    </main>
  )
}