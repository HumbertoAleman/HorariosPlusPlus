import "./Generation.css";

import React from "react";
import SplitLayout from "../../Layouts/Split/SplitLayout.tsx";
import ScheduleComponent from "../../CommonComponents/ScheduleComponent/ScheduleComponent.tsx";

import { getSubject } from "../../API_Functions/subjects.ts";
import { assignSchedules, generateSchedules } from "../../API_Functions/schedules.ts";

import ISubject from "../../CommonComponents/Interfaces/ISubject.ts";
import ISection from "../../CommonComponents/Interfaces/ISection.ts";
import ISchedule from "../../CommonComponents/Interfaces/ISchedule.ts";

let index = 0
const toShow = 1

export default function Generation() {
  const [shownSchedules, setShownSchedules] = React.useState<ISchedule[]>([])
  const [loadedSchedules, setLoadedSchedules] = React.useState<ISchedule[]>([])
  const [loadedSubjects, setLoadedSubjects] = React.useState<ISubject[]>([])

  React.useEffect(() => {
    (async () => {
      const subjects = await getSubject("")
      for (const subject of subjects) {
        subject.enabled = false
        for (const section of subject.sections)
          section.enabled = false
      }
      console.log(subjects)
      setLoadedSubjects(subjects)
    })()
  }, [])

  const generateSchedulesLocal = async () => {
    let nrcList: string = ""
    for (const subject of loadedSubjects.filter(x => x.enabled))
      for (const section of subject.sections.filter(x => x.enabled))
        nrcList += section.nrc.toString() + ","

    const generatedSchedules = await generateSchedules(nrcList)
    setLoadedSchedules(generatedSchedules)
    console.log(generatedSchedules)
  }

  const LSubjectContainer = (data: ISubject) => (
    <div>
      <div className="flex-horizontal course-name">
        {data.name}
        <input onClick={_ => { data.enabled = !data.enabled; setLoadedSubjects(loadedSubjects.map(x => x)) }} defaultChecked={data.enabled} type="checkbox" />
      </div>
      <div>
        {
          data.sections.map(section =>
            <div className="section flex-horizontal">
              <button>
                NRC: {section.nrc}
              </button>
              <input onClick={_ => { section.enabled = !section.enabled; setLoadedSubjects(loadedSubjects.map(x => x)) }} defaultChecked={section.enabled} disabled={!data.enabled} type="checkbox" />
            </div>
          )
        }
      </div>
    </div>
  )

  const scheduleHasFreeDay = (schedule: ISchedule, day: number): boolean => {
    for (const block of schedule.blocks) {
      if (block.day === day) return false
    }
    return true
  }

  const handleScheduleView = (newIndex) => {
    index = Math.min(Math.max(newIndex, 0), loadedSchedules.length - toShow)
    console.log(index)
    setShownSchedules(loadedSchedules.slice(index, index + toShow))
  }

  const generateIdsString = (schedule: ISchedule): string =>
    schedule.blocks.map((x: any) => x.section._id).join(",")

  return (
    <SplitLayout>
      {/* LEFT */}
      <div className="left-container">
        {loadedSubjects.map(subject => LSubjectContainer(subject))}
        <button onClick={_ => generateSchedulesLocal()}> GENERATE </button>
      </div>

      {/* RIGHT */}
      <div>

        {/* DAY BUTTONS */}
        <div className="day-container flex-horizontal flex-center">
          <button onClick={_ => setLoadedSchedules(loadedSchedules.filter(x => scheduleHasFreeDay(x, 1)))} className="day-button" type="button">LUN</button>
          <button onClick={_ => setLoadedSchedules(loadedSchedules.filter(x => scheduleHasFreeDay(x, 2)))} className="day-button" type="button">MAR</button>
          <button onClick={_ => setLoadedSchedules(loadedSchedules.filter(x => scheduleHasFreeDay(x, 3)))} className="day-button" type="button">MIE</button>
          <button onClick={_ => setLoadedSchedules(loadedSchedules.filter(x => scheduleHasFreeDay(x, 4)))} className="day-button" type="button">JUE</button>
          <button onClick={_ => setLoadedSchedules(loadedSchedules.filter(x => scheduleHasFreeDay(x, 5)))} className="day-button" type="button">VIE</button>
          <button onClick={_ => setLoadedSchedules(loadedSchedules.filter(x => scheduleHasFreeDay(x, 6)))} className="day-button" type="button">SAB</button>
          <button onClick={_ => setLoadedSchedules(loadedSchedules.filter(x => scheduleHasFreeDay(x, 7)))} className="day-button" type="button">DOM</button>
        </div>

        {/* SCHEDULES */}
        <div className="flex-vertical">
          {shownSchedules.length > 0 ? shownSchedules.map(x => <button onClick={_ => assignSchedules("123", generateIdsString(x))}> <ScheduleComponent schedule={x} /> </button>) : <></>}
        </div>

        {/* NAV BOTTOM */}
        <div className="nav-container flex-horizontal flex-center">
          <div>
            <button onClick={_ => handleScheduleView(0)} className="nav-button" type="button"> &lt; &lt; </button>
            <button onClick={_ => handleScheduleView(index - toShow)} className="nav-button" type="button"> &lt;</button>
          </div>
          <button className="nav-button save-button" type="button">GUARDAR</button>
          <div>
            <button onClick={_ => handleScheduleView(index + toShow)} className="nav-button" type="button">&gt; </button>
            <button onClick={_ => handleScheduleView(loadedSchedules.length - toShow)} className="nav-button" type="button">&gt; &gt;</button>
          </div>
        </div>
      </div>
    </SplitLayout>
  )
}