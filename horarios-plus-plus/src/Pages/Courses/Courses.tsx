import "./Courses.css";

import React from "react";
import SplitLayout from "../../Layouts/Split/SplitLayout.tsx";
import ISubject from "../../CommonComponents/Interfaces/ISubject.ts"
import ISection from "../../CommonComponents/Interfaces/ISection.ts"
import ISession from "../../CommonComponents/Interfaces/ISession.ts"

const randomSubject = (): ISubject => {
  const subject = {
    name: "Random Subject " + Math.floor(Math.random() * 999),
    sections: [] as ISection[]
  }
  subject.sections = Array.from(Array(5).keys()).map(_ => randomSection(subject))
  return subject
}

const randomSection = (subject: ISubject): ISection => {
  const section = {
    nrc: Math.floor(Math.random() * 999999),
    teacher: "Some dude idk",
    subject: subject,
    sessions: [] as ISession[]
  }
  section.sessions = Array.from(Array(5).keys()).map(_ => randomSession(section))
  return section
}

const randomSession = (section: ISection): ISession => {
  return {
    section: section,
    day: 0,
    start: {
      hour: 0,
      minute: 0
    },
    end: {
      hour: 0,
      minute: 0
    }
  }
}

export default function Courses() {
  const [loadedSubjects, setLoadedSubjects] = React.useState<ISubject[]>(Array.from(Array(5).keys()).map(_ => randomSubject()));
  const [selectedSection, setSelectedSection] = React.useState<ISection | undefined>();

  const changeSelectedSection = (section: ISection) => {
    setSelectedSection(section)
  }

  const editSelectedSection = (section: ISection) => {
    // TODO: After we add the API functions, make this update only if API call was successful
    const newSubjects = loadedSubjects

    // Find subject where section is

    // TODO: Check if its really necessary to reasign the subjectToEdit after editing it
    const subjectToEdit: ISubject = newSubjects[loadedSubjects.findIndex(subject => subject.sections.some(other => other === selectedSection))]
    subjectToEdit.sections[subjectToEdit.sections.findIndex(otherSection => otherSection === selectedSection)] = section
    newSubjects[newSubjects.findIndex(x => x === subjectToEdit)] = subjectToEdit

    setLoadedSubjects(newSubjects)
    setSelectedSection(section)
  }

  const removeSection = (section: ISection) => {
    // TODO: After we add the API functions, make this update only if API call was successful

    // TODO: Check if its really necessary to reasign the subjectToEdit after editing it

    // because we're directly editing the array, we're not editing the value in any real way
    // and thus, we must create a shallow copy of the object for it to actually update the UI
    const newSubjects = loadedSubjects.map(x => x)
    const subjectToEdit: ISubject = newSubjects[newSubjects.findIndex(subject => subject.sections.some(other => other === section))]
    subjectToEdit.sections = subjectToEdit.sections.filter(other => other !== section)
    newSubjects[newSubjects.findIndex(x => x === subjectToEdit)] = subjectToEdit

    if (section === selectedSection)
      setSelectedSection(undefined)
    setLoadedSubjects(newSubjects)
  }

  const LSubjectContainer = (data: ISubject) => (
    <div>
      <div className="course-name">
        {data.name}
      </div>
      <div>
        {
          data.sections.map(section =>
            <div className="section flex-horizontal">
              <button onClick={_ => changeSelectedSection(section)}>
                NRC: {section.nrc}
              </button>
              <button onClick={_ => removeSection(section)}>
                -
              </button>
            </div>
          )
        }
      </div>
    </div>
  )

  const RSessionContainer = (section: ISection, data: ISession) => {
    const generateOptions = (start: number, end: number, step: number) => {
      const ret: number[] = []
      while (start <= end) {
        ret.push(start)
        start += step
      }
      return ret.map(x => <option value={x}>{x}</option>)
    }

    return (
      <div>
        <div className="flex-horizontal">
          <div>
            <select
              onChange={ev =>
                editSelectedSection({
                  ...section,
                  sessions: section.sessions.map(session => session === data
                    ? { ...data, day: parseInt(ev.currentTarget.value) }
                    : session)
                })}
              value={data.day}
              name="days" id="days">
              <option value="1">Lunes</option>
              <option value="2">Martes</option>
              <option value="3">Miercoles</option>
              <option value="4">Jueves</option>
              <option value="5">Viernes</option>
              <option value="6">Sabado</option>
              <option value="7">Domingo</option>
            </select>
          </div>
          <div className="flex-horizontal">
            <div>
              <select
                onChange={ev =>
                  editSelectedSection({
                    ...section,
                    sessions: section.sessions.map(session => session === data
                      ? { ...data, start: { ...data.start, hour: parseInt(ev.currentTarget.value) } }
                      : session)
                  })}
                value={data.start.hour}
                name="firstHour" id="firstHour">
                {generateOptions(6, 20, 1)}
              </select>
            </div>
            <div> : </div>
            <div>
              <select
                onChange={ev =>
                  editSelectedSection({
                    ...section,
                    sessions: section.sessions.map(session => session === data
                      ? { ...data, start: { ...data.start, minute: parseInt(ev.currentTarget.value) } }
                      : session)
                  })}
                value={data.start.minute}
                name="firstMinute" id="firstMinute">
                {generateOptions(0, 45, 15)}
              </select>
            </div>
          </div>
          <div> - </div>
          <div className="flex-horizontal">
            <div>
              <select
                onChange={ev =>
                  editSelectedSection({
                    ...section,
                    sessions: section.sessions.map(session => session === data
                      ? { ...data, end: { ...data.end, hour: parseInt(ev.currentTarget.value) } }
                      : session)
                  })}
                value={data.end.hour}
                name="endHour" id="endHour">
                {generateOptions(6, 20, 1)}
              </select>
            </div>
            <div> : </div>
            <div>
              <select
                onChange={ev =>
                  editSelectedSection({
                    ...section,
                    sessions: section.sessions.map(session => session === data
                      ? { ...data, end: { ...data.end, minute: parseInt(ev.currentTarget.value) } }
                      : session)
                  })}
                value={data.end.minute}
                name="endMinute" id="endMinute">
                {generateOptions(0, 45, 15)}
              </select>
            </div>
          </div>
          <div>
            <button
              onClick={_ =>
                editSelectedSection({
                  ...section,
                  sessions: section.sessions.filter(session => session !== data)
                })}>
              -
            </button>
          </div>
        </div>
      </div>
    )
  }

  const RSectionContainer = (data: ISection) => (
    <div>
      <div className="flex-vertical">
        <div> {data.subject.name} </div>
        <div className="flex-horizontal">
          <div> NRC: </div>
          <input onChange={ev => editSelectedSection({ ...data, nrc: parseInt(ev.currentTarget.value) })} value={data.nrc} type="text" />
        </div>
        <div className="flex-horizontal">
          <div> Profesor: </div>
          <input onChange={ev => editSelectedSection({ ...data, teacher: ev.currentTarget.value })} value={data.teacher} type="text" />
        </div>
      </div>
      <div>
        <div className="flex-horizontal">
          <div>
            Sessiones
          </div>
          <div>
            <button type="button"> + </button>
            <div>
              {data.sessions.map(session => RSessionContainer(data, session))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <SplitLayout>

      {/* LEFT */}
      <div className="left-container">
        {loadedSubjects.map(subject => LSubjectContainer(subject))}
      </div>

      {/* RIGHT */}
      {
        selectedSection === undefined
          ? <></>
          : RSectionContainer(selectedSection)
      }
    </SplitLayout>
  )
}