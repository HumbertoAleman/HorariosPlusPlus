import ISession from "./ISession.ts"
import ISubject from "./ISubject.ts"

export default interface ISection {
  nrc: number,
  teacher: string,
  subject: ISubject,
  sessions: ISession[],
}