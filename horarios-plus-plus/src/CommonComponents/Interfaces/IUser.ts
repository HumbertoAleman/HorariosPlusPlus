export default interface IUser {
    email: string
    cedula: string
    password: string
    permissionLevel: "estudiante" | "profesor" | "organizador" | "administrador" | ""
}