import "./Events.css"

import React from "react"
import SplitLayout from "../../Layouts/Split/SplitLayout.tsx"
import IEvent from "../../CommonComponents/Interfaces/IEvent.ts"

const randomEvent = () => {
  console.log("RANDOM")
  return {
    name: "Test event " + Math.floor(Math.random() * 100),
    day: 0,
    start: {
      hour: 0,
      minute: 0,
    },
    end: {
      hour: 0,
      minute: 0
    }
  }
}

export default function Event() {

  const [loadedEvents, setLoadedEvents] = React.useState(Array.from(Array(32).keys()).map(_ => randomEvent()))
  const [selectedEvent, setSelectedEvents] = React.useState<IEvent | undefined>(undefined)


  const LEventContainer = (data: IEvent) => (
    <div>
      {data.name}
    </div>
  )

  return (
    <SplitLayout>
      {/* LEFT */}
      <div className="left-event-container">
        { loadedEvents.map(e => LEventContainer(e)) }
      </div>

      {/* RIGHT */}
      <div>
        {
          selectedEvent === undefined
          ? <></>
          : <div>
            An event has been selected
          </div>
        }
      </div>
    </SplitLayout>
  )
}
