import ISession from "./ISession.ts"

export default interface ISection {
  nrc: number,
  teacher: string,
  sessions: ISession[]
}