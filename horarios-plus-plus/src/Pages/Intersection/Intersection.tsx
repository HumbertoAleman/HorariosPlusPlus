import "./Intersection.css"

import React from "react"
import SplitLayout from "../../Layouts/Split/SplitLayout.tsx"

import IEvent from "../../CommonComponents/Interfaces/IEvent.ts"
import { getAllEvents } from "../../API_Functions/events.ts"

import ISchedule from "../../CommonComponents/Interfaces/ISchedule.ts"
import { getFromUser } from "../../API_Functions/schedules.ts"
import ScheduleComponent from "../../CommonComponents/ScheduleComponent/ScheduleComponent.tsx"

export default function Intersection() {
  const [loadedEvents, setLoadedEvents] = React.useState<IEvent[]>([])
  const [userSchedule, setLoadedSchedule] = React.useState<ISchedule | undefined>(undefined)
  const [activeSchedule, setActiveSchedule] = React.useState<undefined | ISchedule>(undefined)

  React.useEffect(() => {
    (async () => {
      const schedule = await getFromUser("123")
      setLoadedSchedule(schedule)
    })()
  }, [])

  React.useEffect(() => {
    (async () => {
      const events = (await getAllEvents())
      setLoadedEvents(events)
    })()
  }, [])

  const generateCross = () => {
    if (userSchedule === undefined) return
    setActiveSchedule({ ...userSchedule, blocks: userSchedule?.blocks.concat(loadedEvents.filter(x => x.enabled)) })
  }

  const LEventContainer = (data: IEvent) => (
    <div className="flex-horizontal">
      <div> {data.name} </div>
      <input onChange={_ => data.enabled = !data.enabled} defaultChecked={data.enabled} type="checkbox" />
    </div>
  )

  return (
    <SplitLayout>
      {/* LEFT */}
      <div className="left-event-container">
        {loadedEvents.map(e => LEventContainer(e))}
        <button onClick={_ => generateCross()}>
          CRUZAR
        </button>
      </div>

      {/* RIGHT */}
      <div>
        {activeSchedule !== undefined
          ? <ScheduleComponent schedule={activeSchedule} />
          : userSchedule !== undefined
            ? <ScheduleComponent schedule={userSchedule} />
            : <div> User has no schedule </div>
        }
      </div>
    </SplitLayout>
  )
}
