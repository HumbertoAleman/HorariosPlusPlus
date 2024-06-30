import { headers, httpString, createRequest } from "./common.ts"
import IUser from "../CommonComponents/Interfaces/IUser.ts"

const apiEndpoint = "users/"

const newUser = async (userData : IUser): Promise<any> => {
    const endPointFunction = "newUser"
    const request = createRequest([
        { name: "type", value: userData.permissionLevel },
        { name: "email", value: userData.email },
        { name: "password", value: userData.password },
        { name: "cedula", value: userData.cedula },
    ])

    return fetch(httpString + apiEndpoint + endPointFunction + request, headers)
        .then(response => response.json())
        .then(async data => {
            console.log(data)
            return data
        })
}

const getAllUsers = async (): Promise<any> => {
    const endPointFunction = "getUser"
    const request = createRequest([])

    return fetch(httpString + apiEndpoint + endPointFunction + request, headers)
        .then(response => response.json())
        .then(async data => {
            console.log(data)
            return data
        })
}

const updateUser = async (oldUser: IUser, newUser: IUser): Promise<any> => {
    const endPointFunction = "updateUser"
    const request = createRequest([
        { name: "cedula", value: oldUser.cedula },
        { name: "password", value: newUser.password },
        { name: "email", value: newUser.email },
        { name: "type", value: newUser.permissionLevel },
    ])

    return fetch(httpString + apiEndpoint + endPointFunction + request, headers)
        .then(response => response.json())
        .then(async data => {
            console.log(data)
            return data
        })
}

const deleteUser = async (user: IUser): Promise<any> => {
    const endPointFunction = "deleteUser"
    const request = createRequest([
        { name: "cedula", value: user.cedula },
    ])

    return fetch(httpString + apiEndpoint + endPointFunction + request, headers)
        .then(response => response.json())
        .then(async data => {
            console.log(data)
            return data
        })
}

export { newUser, getAllUsers, updateUser, deleteUser }