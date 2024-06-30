import { headers, httpString, IRequest, createRequest } from "./common.ts"

import ISubject from "../CommonComponents/Interfaces/ISubject.ts"
import ISection from "../CommonComponents/Interfaces/ISection.ts"
import { getSessionsOfSection } from "./sessions.ts"

const apiEndpoint = "sections/"

const newSection = async (subject: ISubject): Promise<any> => {
    const endPointFunction = "newSection"
    const request = createRequest([
        { name: "nrc", value: Math.floor(Math.random() * 65565).toString() },
        { name: "teacher", value: "Some guy" },
        { name: "sessions", value: "" },
        { name: "subjectName", value: subject.name },
    ])

    return fetch(httpString + apiEndpoint + endPointFunction + request, headers)
        .then(response => response.json())
        .then(async data => {
            console.log(data)
            return data
        })
}

const getSectionsFromSubjectID = async (subject: ISubject, id: string): Promise<any> => {
    const endPointFunction = "getSection"
    const request = createRequest([
        { name: "subject", value: id },
    ])

    return fetch(httpString + apiEndpoint + endPointFunction + request, headers)
        .then(response => response.json())
        .then(async data => {
            for (const section of data) {
                section.subject = subject
                section.sessions = await getSessionsOfSection(section)
            }
            return data
        })
}

const updateSection = async (section: ISection, newSection: ISection): Promise<any> => {
    const endPointFunction = "updateSection"
    const request = createRequest([
        { name: "oldNrc", value: section.nrc.toString() },
        { name: "newNrc", value: Number.isNaN(newSection.nrc) ? "0" : newSection.nrc.toString() },
        { name: "newTeacher", value: newSection.teacher },
    ])

    return fetch(httpString + apiEndpoint + endPointFunction + request, headers)
        .then(response => response.json())
        .then(async data => {
            console.log(data)
            return data
        })
}

const removeSection = async (section: ISection) => {
    const endPointFunction = "deleteSection"
    const request = createRequest([
        { name: "nrc", value: section.nrc.toString() },
    ])

    return fetch(httpString + apiEndpoint + endPointFunction + request, headers)
        .then(response => response.json())
        .then(async data => {
            return data
        })
}


export { newSection, getSectionsFromSubjectID, updateSection, removeSection }