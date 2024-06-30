import "./Permissions.css"

import React from "react"
import SplitLayout from "../../Layouts/Split/SplitLayout.tsx"

import IUser from "../../CommonComponents/Interfaces/IUser.ts"
import { deleteUser, getAllUsers, updateUser } from "../../API_Functions/users.ts"

const randomUser = (): IUser => {
  const student: "estudiante" = "estudiante"
  const professor: "profesor" = "profesor"
  const organizer: "organizador" = "organizador"
  const admin: "administrador" = "administrador"

  return {
    email: "randomemail" + Math.floor(Math.random() * 65535) + "@gmail.com",
    cedula: Math.floor(Math.random() * 40000000).toString(),
    password: Math.floor(Math.random() * 40000000).toString(),
    permissionLevel: [student, professor, organizer, admin][Math.floor(Math.random() * 4)]
  }
}

export default function Permissions() {
  const [loadedUsers, setLoadedUsers] = React.useState<IUser[]>([])
  const [selectedUser, setSelectedUser] = React.useState<IUser | undefined>();

  React.useEffect(() => {
    (async () => {
      const events = (await getAllUsers())
      setLoadedUsers(events)
    })()
  }, [])

  const deleteUserLocal = (user: IUser) => {
    deleteUser(user)
      .then(res => {
        if ("code" in res)
          return

        const newUsers = loadedUsers.filter(x => x.email !== user.email)
        setLoadedUsers(newUsers)
        if (selectedUser === user)
          setSelectedUser(undefined)
      })
  }

  const LUserContainer = (data: IUser) => (
    <div className="flex-horizontal">
      <button onClick={_ => setSelectedUser(data)}>
        {data.email}
      </button>
      <button onClick={_ => deleteUserLocal(data)}>
        -
      </button>
    </div>
  )

  const editSelectedUser = (user: IUser) => {
    if (selectedUser === undefined) 
      return

    updateUser(selectedUser, user)
      .then(res => {
        if ("code" in res)
          return

        setLoadedUsers(loadedUsers.map(x => x === selectedUser ? user : x))
        setSelectedUser(user)
      })
  }

  const RUserContainer = (data: IUser) => (
    <div>
      <div>
        {data.email}, {data.cedula}
      </div>
      <select
        value={data.permissionLevel}
        onChange={ev => editSelectedUser({ ...data, permissionLevel: ev.currentTarget.value as "estudiante" | "profesor" | "organizador" | "administrador" })}
        name={data.email}
        id={data.email}>
        <option value="estudiante">estudiante</option>
        <option value="profesor">profesor</option>
        <option value="organizador">organizador</option>
        <option value="administrador">administrador</option>
      </select>
    </div>
  )

  return (
    <SplitLayout>
      {/* LEFT */}
      <div className="flex-vertical">
        {
          loadedUsers.map(user => LUserContainer(user))
        }
      </div>

      {/* RIGHT */}
      <div>
        {
          selectedUser === undefined
            ? <></>
            : RUserContainer(selectedUser)
        }
      </div>
    </SplitLayout>
  )
}
