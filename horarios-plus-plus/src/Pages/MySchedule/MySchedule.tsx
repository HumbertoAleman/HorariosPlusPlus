import React from "react"
import NavBar from "../../CommonComponents/NavBar/NavBar.tsx";
import SingleLayout from "../../Layouts/Single/SingleLayout.tsx"
import ScheduleComponent from "../../CommonComponents/ScheduleComponent/ScheduleComponent.tsx"

export default function MySchedule() {
  return (
    <SingleLayout>
      <ScheduleComponent/>
    </SingleLayout>
  )
}