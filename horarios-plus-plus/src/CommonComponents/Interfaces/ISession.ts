import ISection from "./ISection";

export default interface ISession {
  section: ISection
  day: number,
  start: {
    hour: number,
    minute: number,
  },
  end: {
    hour: number,
    minute: number,
  },
}