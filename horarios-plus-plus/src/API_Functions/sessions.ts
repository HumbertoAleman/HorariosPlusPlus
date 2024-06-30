import { headers, httpString, IRequest, createRequest } from "./common.ts"

import ISection from "../CommonComponents/Interfaces/ISection.ts"
import ISession from "../CommonComponents/Interfaces/ISession.ts"

const apiEndpoint = "sessions/"

const newSession = async (section: ISection, session: ISession): Promise<any> => {
    const endPointFunction = "newSession"
    const request = createRequest([
        { name: "nrc", value: section.nrc.toString() },
        { name: "startHour", value: session.start.hour.toString() },
        { name: "startMinute", value: session.start.minute.toString() },
        { name: "endHour", value: session.end.hour.toString() },
        { name: "endMinute", value: session.end.minute.toString() },
        { name: "day", value: session.day.toString() },
    ])

    return fetch(httpString + apiEndpoint + endPointFunction + request, headers)
        .then(response => response.json()).catch(e => console.error(e))
        .then(async data => {
            data.section = section
            console.log(data)
            return data
        })
}

const getSessionsOfSection = async (section: ISection): Promise<any> => {
    const endPointFunction = "getSessions"
    const request = createRequest([
        { name: "nrc", value: section.nrc.toString() },
    ])

    return fetch(httpString + apiEndpoint + endPointFunction + request, headers)
        .then(response => response.json())
        .then(async data => {
            for (const session of data) {
                session.section = section
            }
            console.log(data)
            return data
        })
}

const updateSession = async (section: ISection, session: ISession, newSession: ISession): Promise<any> => {
    const endPointFunction = "updateSession"
    const request = createRequest([
        { name: "oldDay", value: session.day.toString() },
        { name: "oldStartHour", value: session.start.hour.toString() },
        { name: "oldStartMinute", value: session.start.minute.toString() },
        { name: "oldEndHour", value: session.end.hour.toString() },
        { name: "oldEndMinute", value: session.end.minute.toString() },

        { name: "newDay", value: newSession.day.toString() },
        { name: "newStartHour", value: newSession.start.hour.toString() },
        { name: "newStartMinute", value: newSession.start.minute.toString() },
        { name: "newEndHour", value: newSession.end.hour.toString() },
        { name: "newEndMinute", value: newSession.end.minute.toString() },

        { name: "nrc", value: section.nrc.toString() },
    ])

    return fetch(httpString + apiEndpoint + endPointFunction + request, headers)
        .then(response => response.json())
        .then(async data => {
            data.section = section
            return data
        })
}

const removeSession = async (section: ISection, session: ISession): Promise<any> => {
    const endPointFunction = "deleteSession"
    const request = createRequest([
        { name: "day", value: session.day.toString() },
        { name: "startHour", value: session.start.hour.toString() },
        { name: "startMinute", value: session.start.minute.toString() },
        { name: "endHour", value: session.end.hour.toString() },
        { name: "endMinute", value: session.end.minute.toString() },
        { name: "nrc", value: section.nrc.toString() },
    ])
    console.log(httpString + apiEndpoint + endPointFunction + request)

    return fetch(httpString + apiEndpoint + endPointFunction + request, headers)
        .then(response => response.json())
        .then(async data => {
            console.log(data)
            return data
        })
}

export { newSession, getSessionsOfSection, updateSession, removeSession }