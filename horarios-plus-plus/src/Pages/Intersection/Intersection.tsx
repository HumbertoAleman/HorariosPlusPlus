import "./Intersection.css"

import React from "react"
import SplitLayout from "../../Layouts/Split/SplitLayout.tsx"

export default function Intersection()  {
  return (
    <SplitLayout>
      {/* LEFT */}
      <div>
        Here goes Intersection
      </div>

      {/* RIGHT */}
      <div>
        Here also goes Intersection
      </div>
    </SplitLayout>
  )
}
