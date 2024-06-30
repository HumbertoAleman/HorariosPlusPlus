import "./Courses.css";

import React from "react";
import SplitLayout from "../../Layouts/Split/SplitLayout.tsx";
import ISubject from "../../CommonComponents/Interfaces/ISubject.ts"
import ISection from "../../CommonComponents/Interfaces/ISection.ts"
import ISession from "../../CommonComponents/Interfaces/ISession.ts"

import { newSection, removeSection, updateSection } from "../../API_Functions/sections.ts";
import { getSubject } from "../../API_Functions/subjects.ts";
import { newSession, removeSession, updateSession } from "../../API_Functions/sessions.ts";

const randInt = (from: number, to: number): number => Math.floor(Math.random() * (to - from)) + from

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

export default function Courses() {
  const [loadedSubjects, setLoadedSubjects] = React.useState<ISubject[]>([]);
  const [selectedSection, setSelectedSection] = React.useState<ISection | undefined>();

  React.useEffect(() => {
    (async () => {
      const subjects = await getSubject("")
      setLoadedSubjects(subjects)
    })()
  }, [])

  let updating: boolean = false

  const newSectionLocal = (subject: ISubject) => {
    newSection(subject)
      .then(res => {
        if ("code" in res)
          return
        const newSubjects = loadedSubjects
        newSubjects[newSubjects.findIndex(x => x.name === subject.name)].sections.push(res)
        setLoadedSubjects(newSubjects)
        setSelectedSection(res)
      })
  }

  const newSessionLocal = (section: ISection) => {
    const sessionToAdd: ISession = randomSession(section)
    newSession(section, sessionToAdd)
      .then(res => {
        if ("code" in res || selectedSection === undefined)
          return

        selectedSection.sessions.push(res)
        setSelectedSection({ ...selectedSection })
      })
  }

  const removeSessionLocal = (section: ISection, session: ISession) => {
    removeSession(section, session)
      .then(res => {
        if ("code" in res || selectedSection === undefined) return

        for (const subject of loadedSubjects)
          for (const section of subject.sections)
            if (section.sessions.some(x => x === session)) {
              section.sessions = selectedSection.sessions.filter(x => x !== session)
            }
        setSelectedSection({ ...selectedSection, sessions: selectedSection.sessions.filter(x => x !== session) })
      })
  }

  const updateSessionLocal = (section: ISection, session: ISession, newSession: ISession) => {
    if (selectedSection === undefined || updating)
      return

    updating = true
    updateSession(section, session, newSession)
      .then(res => {
        if ("code" in res || selectedSection === undefined) return

        for (const subject of loadedSubjects)
          for (const section of subject.sections)
            if (section.sessions.some(x => x === session)) {
              section.sessions[selectedSection.sessions.findIndex(x => x === session)] = newSession
            }
        setSelectedSection({ ...selectedSection, sessions: selectedSection.sessions.map(x => x === session ? newSession : x) })
      })
      .finally(() => {
        updating = false
      })
  }

  const editSelectedSectionLocal = (section: ISection) => {
    if (selectedSection === undefined || updating)
      return

    updating = true
    updateSection(selectedSection, section)
      .then(res => {
        if ("code" in res)
          return

        const newSubjects = loadedSubjects

        // TODO: Check if its really necessary to reasign the subjectToEdit after editing it
        const subjectToEdit: ISubject = newSubjects[loadedSubjects.findIndex(subject => subject.sections.some(other => other.nrc === selectedSection.nrc))]
        subjectToEdit.sections[subjectToEdit.sections.findIndex(otherSection => otherSection === selectedSection)] = res

        newSubjects[newSubjects.findIndex(x => x === subjectToEdit)] = subjectToEdit

        setLoadedSubjects(newSubjects)
        setSelectedSection(res)
      })
      .finally(() => {
        updating = false
      })
  }

  const removeSectionLocal = (section: ISection) => {
    removeSection(section)
      .then(res => {
        if ("code" in res)
          return

        // because we're directly editing the array, we're not editing the value in any real way
        // and thus, we must create a shallow copy of the object for it to actually update the UI
        const newSubjects = loadedSubjects.map(x => x)
        const subjectToEdit: ISubject = newSubjects[newSubjects.findIndex(subject => subject.sections.some(other => other === section))]
        subjectToEdit.sections = subjectToEdit.sections.filter(other => other !== section)
        newSubjects[newSubjects.findIndex(x => x === subjectToEdit)] = subjectToEdit

        if (section === selectedSection)
          setSelectedSection(undefined)
        setLoadedSubjects(newSubjects)
      })
  }

  const LSubjectContainer = (data: ISubject) => (
    <div>
      <div className="flex-horizontal course-name">
        {data.name}
        <button onClick={_ => newSectionLocal(data)} > + </button>
      </div>
      <div>
        {
          data.sections.map(section =>
            <div className="section flex-horizontal">
              <button onClick={_ => setSelectedSection(section)}>
                NRC: {section.nrc}
              </button>
              <button onClick={_ => removeSectionLocal(section)}>
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
              onChange={ev => updateSessionLocal(section, data, { ...data, day: parseInt(ev.currentTarget.value) })}
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
                onChange={ev => updateSessionLocal(section, data, { ...data, start: { ...data.start, hour: parseInt(ev.currentTarget.value) } })}
                value={data.start.hour}
                name="firstHour" id="firstHour">
                {generateOptions(6, 20, 1)}
              </select>
            </div>
            <div> : </div>
            <div>
              <select
                onChange={ev => updateSessionLocal(section, data, { ...data, start: { ...data.start, minute: parseInt(ev.currentTarget.value) } })}
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
                onChange={ev => updateSessionLocal(section, data, { ...data, end: { ...data.end, hour: parseInt(ev.currentTarget.value) } })}
                value={data.end.hour}
                name="endHour" id="endHour">
                {generateOptions(6, 20, 1)}
              </select>
            </div>
            <div> : </div>
            <div>
              <select
                onChange={ev => updateSessionLocal(section, data, { ...data, end: { ...data.end, minute: parseInt(ev.currentTarget.value) } })}
                value={data.end.minute}
                name="endMinute" id="endMinute">
                {generateOptions(0, 45, 15)}
              </select>
            </div>
          </div>
          <div>
            <button
              onClick={_ => removeSessionLocal(section, data)}>
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
          <input onChange={ev => editSelectedSectionLocal({ ...data, nrc: parseInt(ev.currentTarget.value) })} value={data.nrc} type="text" />
        </div>
        <div className="flex-horizontal">
          <div> Profesor: </div>
          <input onChange={ev => editSelectedSectionLocal({ ...data, teacher: ev.currentTarget.value })} value={data.teacher} type="text" />
        </div>
      </div>
      <div>
        <div className="flex-horizontal">
          <div>
            Sessiones
          </div>
          <div>
            <button onClick={_ => newSessionLocal(data)} type="button"> + </button>
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