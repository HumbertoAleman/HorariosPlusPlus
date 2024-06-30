import { headers, httpString, IRequest, createRequest } from "./common.ts"
import ISubject from "../CommonComponents/Interfaces/ISubject.ts"
import ISection from "../CommonComponents/Interfaces/ISection.ts"
import { getSectionsFromSubjectID } from "./sections.ts"
import Subject from "../../../horarios-plus-plus-server/src/Modelos/subject.model.js"

const apiEndpoint = "subjects/"

const newSubject = async (subject: ISubject): Promise<any> => {
    const endPointFunction = "newSubject"
    const request = createRequest([
        { name: "", value: "" },
    ])

    return fetch(httpString + apiEndpoint + endPointFunction + request, headers)
        .then(response => response.json())
        .then(async data => {
            console.log(data)
            return data
        })
}

const removeSubject = async (subject: ISubject): Promise<any> => {
    const endPointFunction = "deleteSubject"
    const request = createRequest([
        { name: "", value: "" },
    ])

    return fetch(httpString + apiEndpoint + endPointFunction + request, headers)
        .then(response => response.json())
        .then(async data => {
            console.log(data)
            return data
        })
}

const updateSubject = async (oldSubject: ISubject, newSubject: ISubject): Promise<any> => {
    const endPointFunction = "updateSubject"
    const request = createRequest([
        { name: "", value: "" },
    ])

    const endRequest = httpString + apiEndpoint + endPointFunction + request
    console.log("Making request to: " + endRequest)
    return fetch(endRequest, headers)
        .then(response => response.json())
        .then(async data => {
            return data
        })
}

const getSubject = async (name: string): Promise<any> => {
    const endPointFunction = "getSubject"
    const request = createRequest([])

    const endRequest = httpString + apiEndpoint + endPointFunction + request
    console.log("Making request to: " + endRequest)
    return fetch(endRequest, headers)
        .then(response => response.json())
        .then(async data => {
            if (Array.isArray(data))
                for (const subject of data)
                    subject.sections = await getSectionsFromSubjectID(subject, subject._id)
            return data
        })
}

export { newSubject, getSubject, updateSubject, removeSubject }