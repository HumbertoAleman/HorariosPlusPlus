import React from "react"
import NavBar from "../../CommonComponents/NavBar/NavBar.tsx";
import SingleLayout from "../../Layouts/Single/SingleLayout.tsx"
import ScheduleComponent from "../../CommonComponents/ScheduleComponent/ScheduleComponent.tsx"

import ISchedule from "../../CommonComponents/Interfaces/ISchedule.ts"
import ISubject from  "../../CommonComponents/Interfaces/ISubject.ts"
import IEvent from    "../../CommonComponents/Interfaces/IEvent.ts"
import ISession from  "../../CommonComponents/Interfaces/ISession.ts"
import ISection from  "../../CommonComponents/Interfaces/ISection.ts"

const randInt = (from: number, to: number): number => Math.floor(Math.random() * (to - from)) + from

const randomSchedule = ():ISchedule => {
  return {
    blocks: randomSubject().sections[0].sessions
  }
}

const randomSubject = (): ISubject => {
  const subject = {
    name: "Random Subject " + randInt(0, 65535),
    sections: [] as ISection[]
  }
  subject.sections = Array.from(Array(1).keys()).map(_ => randomSection(subject))
  return subject
}

const randomSection = (subject: ISubject): ISection => {
  const section = {
    nrc: Math.floor(randInt(0, 65535)),
    teacher: "Some dude idk",
    subject: subject,
    sessions: [] as ISession[]
  }
  section.sessions = Array.from(Array(2).keys()).map(_ => randomSession(section))
  return section
}

const randomSession = (section: ISection): ISession => {
  return {
    section: section,
    day: randInt(1, 6),
    start: {
      hour: randInt(6, 14),
      minute: Math.floor(randInt(0, 45) / 15) * 15
    },
    end: {
      hour: randInt(15, 20),
      minute: Math.floor(randInt(0, 45) / 15) * 15
    }
  }
}

export default function MySchedule() {
  return (
    <SingleLayout>
      <ScheduleComponent schedule={ randomSchedule() }/>
    </SingleLayout>
  )
}