import mongoose from "mongoose"
import Section from "../../models/section.model.js"
import Subject from "../../models/subject.model.js"
import Session from "../../models/session.model.js"

function hoursIntersect(start_x, end_x, start_y, end_y) {
  return ((start_x.minute + start_x.hour * 60 < end_y.minute + end_y.hour * 60) &&
    (start_y.minute + start_y.hour * 60 < end_x.minute + end_x.hour * 60))
}

export default async function newSession(req, res) {
  const sessionDay = req?.query?.day
  const sessionStart = {
    minute: req?.query?.startMinute,
    hour: req?.query?.startHour
  }
  const sessionEnd = {
    minute: req?.query?.endMinute,
    hour: req?.query?.endHour
  }
  const sessionNrc = req?.query?.nrc

  if (sessionNrc === undefined) {
    console.error("ERROR : sessionNRC is undefined, cannot create a new session")
    res?.send({ code: 0 })
    return 0
  } else if (await Section.exists({ nrc: sessionNrc }).then(res => res === null)) {
    console.error("ERROR : Cannot create a session without assigning it an NRC")
    res?.send({ code: 0 })
    return 0
  }

  if (sessionStart.minute === undefined || sessionStart.hour === undefined) {
    console.error("ERROR : sessionStart has an undefined value, cannot create a new session")
    res?.send({ code: 0 })
    return 0
  }

  if (sessionEnd.minute === undefined || sessionEnd.hour === undefined) {
    console.error("ERROR : sessionEnd has an undefined value, cannot create a new session")
    res?.send({ code: 0 })
    return 0
  }

  if (sessionDay === undefined) {
    console.error("ERROR : sessionDay is undefined, cannot create a new session")
    res?.send({ code: 0 })
    return 0
  }

  let section = await Section.findOne({ nrc: sessionNrc })
  let sessionList = []
  for (const sessionId of section.sessions) {
    let session = await Session.findById(sessionId)
    if (session) { sessionList.push(session) }
  }

  if (sessionList.some(session => session.day === sessionDay && hoursIntersect(sessionStart, sessionEnd, session.start, session.end))) {
    console.error("ERROR : A session in this section collides with the hours specified")
    res?.send({ code: 0 })
    return 0
  }

  let newSession = await new Session({
    _id: new mongoose.mongo.ObjectId(),
    day: sessionDay,
    start: {
      hour: sessionStart.hour,
      minute: sessionStart.minute,
    },
    end: {
      hour: sessionEnd.hour,
      minute: sessionEnd.minute,
    },
    section: new mongoose.mongo.ObjectId(section._id)
  })
  const savedSession = await newSession.save()
  if (savedSession !== newSession) {
    console.error("ERROR : Unknown error when saving session")
    res?.send({ code: 0 })
    return 0
  }

  await Section.findOneAndUpdate(section,
    { sessions: section.sessions.concat(new mongoose.mongo.ObjectId(savedSession._id)) })

  res?.send(savedSession)
  return savedSession
}