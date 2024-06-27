export default interface IUser {
    email: string
    permissionLevel: "estudiante" | "profesor" | "organizador" | "administrador"
}