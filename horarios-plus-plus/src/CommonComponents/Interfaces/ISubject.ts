import ISection from "./ISection";

export default interface ISubject {
  name: string,
  sections: ISection[],
  enabled?: boolean
}