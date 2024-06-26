import IEvent from "./IEvent";
import ISession from "./ISession";

export default interface ISchedule {
  blocks: (IEvent | ISession)[]
}