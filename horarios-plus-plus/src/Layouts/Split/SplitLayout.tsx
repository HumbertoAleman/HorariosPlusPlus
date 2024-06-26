import React from "react"
import NavBar from "../../Pages/NavBar/NavBar.tsx"

// TODO: Transformar esto en el split layout
export default function SplitLayout({ children }) {
  return (
    <div className="split-layout">
      <main>
        <NavBar/>
        { children }
      </main>
    </div>
  )
}