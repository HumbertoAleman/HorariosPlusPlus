export default interface IEvent {
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