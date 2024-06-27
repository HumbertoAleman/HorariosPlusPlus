import "./Events.css"

import React from "react"
import SplitLayout from "../../Layouts/Split/SplitLayout.tsx"
import IEvent from "../../CommonComponents/Interfaces/IEvent.ts"

const randomEvent = () => {
  return {
    name: "Test event " + Math.floor(Math.random() * 999),
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

const startBeforeEndHour = (start: { hour: number, minute: number }, end: { hour: number, minute: number }) =>
  start.hour * 60 + start.minute < end.hour * 60 + end.minute

export default function Event() {

  const [loadedEvents, setLoadedEvents] = React.useState<IEvent[]>([])
  const [selectedEvent, setSelectedEvent] = React.useState<IEvent | undefined>(undefined)

  const selectEvent = (event: IEvent) => {
    setSelectedEvent(event)
  }


  const editSelectedEvent = (event: IEvent) => {
    if (event === undefined) {
      console.error("ERROR: Edit selected event somehow got undefined")
      return
    }

    if (event.name === "") {
      console.error("ERROR: Cannot add an event with an empty name")
      return
    }

    if (!startBeforeEndHour(event.start, event.end)) {
      console.error("ERROR: Cannot add an event that has a start hour after its end hour")
      return
    }

    if (loadedEvents.some(x => x === event)) {
      console.error("ERROR: Cannot add two events with the same name")
      return
    }

    // TODO: After we add the API functions, make this update only if API call was successful
    const newEvents = loadedEvents
    newEvents[loadedEvents.findIndex(x => x === selectedEvent)] = event

    setLoadedEvents(newEvents)
    setSelectedEvent(event)
  }

  const removeEvent = (event: IEvent) => {
    // TODO: After we add the API functions, make this update only if API call was successful
    setLoadedEvents(loadedEvents.filter(x => x !== event))
  }

  const LEventContainer = (data: IEvent) => (
    <div className="flex-horizontal">
      <button className="event-button" onClick={_ => selectEvent(data)}>
        {data.name}
      </button>
      <button onClick={_ => removeEvent(data)}> - </button>
    </div>
  )

  const REventContainer = (data: IEvent) => {

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
        <input
          onChange={ev => editSelectedEvent({ ...data, name: ev.currentTarget.value })}
          value={data.name}
          type="text" />
        <div className="flex flex-horizontal">
          <div>
            Start time:
          </div>
          <div className="flex flex-horizontal">
            <div>
              Hour:
            </div >
            <select
              value={data.start.hour}
              onChange={ev => editSelectedEvent({ ...data, start: { ...data.start, hour: parseInt(ev.currentTarget.value) } })}
              name={data.name}
              id={data.name}>
              { generateOptions(6, 20, 1) }
            </select>
            <div>
              Minute:
            </div>
            <select
              value={data.start.minute}
              onChange={ev => editSelectedEvent({ ...data, start: { ...data.start, minute: parseInt(ev.currentTarget.value) } })}
              name={data.name}
              id={data.name}>
              { generateOptions(0, 45, 15) }
            </select>
          </div>
        </div>
        <div className="flex flex-horizontal">
          <div>
            End time:
          </div>
          <div className="flex flex-horizontal">
            <div>
              Hour:
            </div>
            <select
              value={data.end.hour}
              onChange={ev => editSelectedEvent({ ...data, end: { ...data.end, hour: parseInt(ev.currentTarget.value) } })}
              name={data.name}
              id={data.name}>
              { generateOptions(6, 20, 1) }
            </select>
            <div>
              Minute:
            </div>
            <select
              value={data.end.minute}
              onChange={ev => editSelectedEvent({ ...data, end: { ...data.end, minute: parseInt(ev.currentTarget.value) } })}
              name={data.name}
              id={data.name}>
              { generateOptions(0, 45, 15) }
            </select>
          </div>
        </div>
      </div>
    )
  }

  return (
    <SplitLayout>
      {/* LEFT */}
      <div className="left-event-container">
        <button onClick={ev => setLoadedEvents(loadedEvents.concat(randomEvent()))}> + </button>
        { loadedEvents.map(e => LEventContainer(e)) }
      </div>

      {/* RIGHT */}
      <div>
        {
          selectedEvent === undefined
            ? <></>
            : <div>
              {REventContainer(selectedEvent)}
            </div>
        }
      </div>
    </SplitLayout>
  )
}
