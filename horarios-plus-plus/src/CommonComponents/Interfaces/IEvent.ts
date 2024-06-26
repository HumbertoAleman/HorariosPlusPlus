export default interface IEvent {
  name: string,
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