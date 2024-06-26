import "./ScheduleComponent.css"
import React from "react"

const hours = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
const minutes = [0, 15, 30, 45]

export default function ScheduleComponent() {
  const numberRow = () => {
    return hours.map(hour => 
      minutes.map(minute =>
        minute === 0
        ? <div style={{ gridRow: "span 4" }}> {hour} </div>
        : <></>
      ))
  }

  return (
    <div className="schedule-component">
      <div> Hours </div>
      {numberRow()}
    </div>
  )
}