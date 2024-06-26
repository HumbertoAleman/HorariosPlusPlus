import "./Events.css"

import React from "react"
import SplitLayout from "../../Layouts/Split/SplitLayout.tsx"

export default function Event()  {
  return (
    <SplitLayout>
      {/* LEFT */}
      <div>
        Here goes events
      </div>

      {/* RIGHT */}
      <div>
        Here also goes events
      </div>
    </SplitLayout>
  )
}
