import ISchedule from "../CommonComponents/Interfaces/ISchedule.ts"
import { headers, httpString, IRequest, createRequest } from "./common.ts"
import { getSectionsFromSectionId } from "./sections.ts"
import { getSessionsOfSection } from "./sessions.ts"

const apiEndpoint = "schedules/"

const generateSchedules = async (nrcList: string): Promise<any> => {
    const endPointFunction = "generateSchedules"
    const request = createRequest([
        { name: "nrcs", value: nrcList },
    ])

    return fetch(httpString + apiEndpoint + endPointFunction + request, headers)
        .then(response => response.json())
        .then(async data => {
            console.log(data)
            for (let [index, value] of data.entries()) {
                let sessionList = []
                for (const section of value) {
                    section.sessions = await getSessionsOfSection(section)
                    sessionList = sessionList.concat(section.sessions)
                }
                data[index] = { blocks: sessionList }
            }
            console.log(data)

            return data
        })
}

const assignSchedules = async (ownerCedula: string, idsList: string) => {
    const endPointFunction = "assignSchedule"
    const request = createRequest([
        { name: "ids", value: idsList },
        { name: "cedula", value: ownerCedula },
    ])

    return fetch(httpString + apiEndpoint + endPointFunction + request, headers)
        .then(response => response.json())
        .then(async data => {
            console.log(data)
            return data
        })
}

const getFromUser = async (ownerCedula: string) => {
    const endPointFunction = "getFromUser"
    const request = createRequest([
        { name: "cedula", value: ownerCedula },
    ])

    return fetch(httpString + apiEndpoint + endPointFunction + request, headers)
        .then(response => response.json())
        .then(async data => {
            let sessionList = []
            for (const sectionId of data.blocks) {
                const section = await getSectionsFromSectionId(sectionId)
                sessionList = sessionList.concat(section.sessions)
            }
            data.blocks = sessionList
            return data
        })
}

export { generateSchedules, assignSchedules, getFromUser }