export default interface ISession {
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