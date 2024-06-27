import "./ScheduleComponent.css"

import React from "react"
import ISchedule from "../Interfaces/ISchedule.ts"
import ISubject from "../Interfaces/ISubject.ts"
import IEvent from "../Interfaces/IEvent.ts"
import ISession from "../Interfaces/ISession.ts"
import ISection from "../Interfaces/ISection.ts"

const daysOfWeek = ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado", "Domingo"]
const hours = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
const minutes = [0, 15, 30, 45]

export default function ScheduleComponent({ schedule }: { schedule: ISchedule }) {
  const numberRow = () => {
    return hours.map(hour =>
      minutes.map(minute =>
        minute === 0
          ? <div style={{ gridRow: "span 4" }}> { hour } - { hour + 1 } </div>
          : <></>
      ))
  }

  const generateDay = (day: number) => {
    let toSkip: number = 0
    const eventsFromDay: IEvent[] = schedule.blocks.filter(x => "name" in x && x.day === day) as IEvent[]
    const sessionsFromDay: ISession[] = schedule.blocks.filter(x => !("name" in x) && x.day === day) as ISession[]

    return (
      <>
        <div> {daysOfWeek[day - 1]} </div>
        {hours.map(hour =>
          minutes.map(minute => {
            if (toSkip > 0) {
              toSkip -= 1
              return <></>
            }

            const sessionToAdd = sessionsFromDay.find(x => x.start.hour === hour && x.start.minute === minute)
            console.log(sessionToAdd)
            if (sessionToAdd !== undefined) {
              toSkip = ((sessionToAdd.end.hour * 60 + sessionToAdd.end.minute)
                - (sessionToAdd.start.hour * 60 + sessionToAdd.start.minute)) / 15
                console.log()
              return <div style={{ backgroundColor: "blue", gridRow: toSkip + 1 + " span" }}>
                {sessionToAdd.section.nrc}
              </div>
            }

            const eventToAdd = eventsFromDay.find(x => x.start.hour === hour && x.start.minute === minute)
            if (eventToAdd !== undefined) {
              toSkip = ((eventToAdd.end.hour * 60 + eventToAdd.end.minute)
                - (eventToAdd.start.hour * 60 + eventToAdd.start.minute)) / 15
              return <div style={{ backgroundColor: "blue", gridRow: toSkip + " span" }}>
                {eventToAdd.name}
              </div>
            }

            return <div></div>
          }
          ))}
      </>
    )
  }

  return (
    <div className="schedule-component">
      <div> Hours </div>
      { numberRow() }

      { generateDay(1) }
      { generateDay(2) }
      { generateDay(3) }
      { generateDay(4) }
      { generateDay(5) }
      { generateDay(6) }
      { generateDay(7) }
    </div>
  )
}