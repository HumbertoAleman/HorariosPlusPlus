import { headers, httpString, IRequest, createRequest } from "./common.ts"
import IEvent from "../CommonComponents/Interfaces/IEvent.ts"

const apiEndpoint = "events/"

const newEvent = async (event: IEvent): Promise<any> => {
    const endPointFunction = "newEvent"
    const request = createRequest([
        { name: "day", value: event.day.toString() },
        { name: "name", value: event.name },
        { name: "startHour", value: event.start.hour.toString() },
        { name: "startMinute", value: event.start.minute.toString() },
        { name: "endHour", value: event.end.hour.toString() },
        { name: "endMinute", value: event.end.minute.toString() },
    ])

    return fetch(httpString + apiEndpoint + endPointFunction + request, headers)
        .then(response => response.json())
        .then(async data => {
            console.log(data)
            return data
        })
}

const removeEvent = async (event: IEvent): Promise<any> => {
    const endPointFunction = "deleteEvent"
    const request = createRequest([
        { name: "day", value: event.day.toString() },
        { name: "name", value: event.name },
        { name: "startHour", value: event.start.hour.toString() },
        { name: "startMinute", value: event.start.minute.toString() },
        { name: "endHour", value: event.end.hour.toString() },
        { name: "endMinute", value: event.end.minute.toString() },
    ])

    return fetch(httpString + apiEndpoint + endPointFunction + request, headers)
        .then(response => response.json())
        .then(async data => {
            console.log(data)
            return data
        })
}

const updateEvent = async (oldEvent: IEvent, newEvent: IEvent): Promise<any> => {
    const endPointFunction = "updateEvent"
    const request = createRequest([
        { name: "oldDay", value: oldEvent.day.toString() },
        { name: "oldName", value: oldEvent.name },
        { name: "oldStartHour", value: oldEvent.start.hour.toString() },
        { name: "oldStartMinute", value: oldEvent.start.minute.toString() },
        { name: "oldEndHour", value: oldEvent.end.hour.toString() },
        { name: "oldEndMinute", value: oldEvent.end.minute.toString() },

        { name: "newDay", value: newEvent.day.toString() },
        { name: "newName", value: newEvent.name },
        { name: "newStartHour", value: newEvent.start.hour.toString() },
        { name: "newStartMinute", value: newEvent.start.minute.toString() },
        { name: "newEndHour", value: newEvent.end.hour.toString() },
        { name: "newEndMinute", value: newEvent.end.minute.toString() },
    ])

    const endRequest = httpString + apiEndpoint + endPointFunction + request
    console.log("Making request to: " + endRequest)
    return fetch(endRequest, headers)
        .then(response => response.json())
        .then(async data => {
            return data
        })
}

const getEventsFromDay = async (day: number): Promise<any> => {
    const endPointFunction = "getEvents"
    const request = createRequest([
        { name: "day", value: day.toString() },
    ])

    const endRequest = httpString + apiEndpoint + endPointFunction + request
    console.log("Making request to: " + endRequest)
    return fetch(endRequest, headers)
        .then(response => response.json())
        .then(async data => {
            return data
        })
}

const getAllEvents = async () => {
    return Promise.all([getEventsFromDay(1), getEventsFromDay(2), getEventsFromDay(3), getEventsFromDay(4), getEventsFromDay(5), getEventsFromDay(6), getEventsFromDay(7)]).then(x => x.flat())
}

export { newEvent, getEventsFromDay, getAllEvents, updateEvent, removeEvent }