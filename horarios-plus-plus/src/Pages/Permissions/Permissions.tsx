import "./Permissions.css"

import React from "react"
import SplitLayout from "../../Layouts/Split/SplitLayout.tsx"

import IUser from "../../CommonComponents/Interfaces/IUser.ts"

const randomUser = (): IUser => {
  const student: "estudiante" = "estudiante"
  const professor: "profesor" = "profesor"
  const organizer: "organizador" = "organizador"
  const admin: "administrador" = "administrador"

  return {
    email: "randomemail" + Math.floor(Math.random() * 65535) + "@gmail.com",
    permissionLevel: [student, professor, organizer, admin][Math.floor(Math.random() * 4)]
  }
}

export default function Permissions() {
  const [loadedUsers, setLoadedUsers] = React.useState<IUser[]>(Array.from(Array(32).keys()).map(_ => randomUser()))
  const [selectedUser, setSelectedUser] = React.useState<IUser | undefined>();

  const LUserContainer = (data: IUser) => (
    <button onClick={_ => setSelectedUser(data)}>
      {data.email}
    </button>
  )

  const changeSelectedUser = (user: IUser) => {
    setLoadedUsers(loadedUsers.map(x => x === selectedUser ? user : x))
    setSelectedUser(user)
  }

  const RUserContainer = (data: IUser) => (
    <div>
      <div>
        {data.email}
      </div>
      <select
        value={data.permissionLevel}
        onChange={ev => changeSelectedUser({ ...data, permissionLevel: ev.currentTarget.value as "estudiante" | "profesor" | "organizador" | "administrador" })}
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
