import mongoose from "mongoose"

import Section from "../../models/section.model.js"
import Session from "../../models/session.model.js"

export default async function deleteSession(req, res) {
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
    console.error("ERROR : sessionNRC is undefined, cannot delete session")
    res?.send({ code: 0 })
    return 0
  } else if (await Section.exists({ nrc: sessionNrc }).then(res => res === null)) {
    console.error("ERROR : Cannot delete from session that doesn't exist")
    res?.send({ code: 0 })
    return 0
  }

  if (sessionStart.minute === undefined || sessionStart.hour === undefined) {
    console.error("ERROR : sessionStart has an undefined value, cannot delete session")
    res?.send({ code: 0 })
    return 0
  }

  if (sessionEnd.minute === undefined || sessionEnd.hour === undefined) {
    console.error("ERROR : sessionEnd has an undefined value, cannot delete session")
    res?.send({ code: 0 })
    return 0
  }

  if (sessionDay === undefined) {
    console.error("ERROR : sessionDay is undefined, cannot delete session")
    res?.send({ code: 0 })
    return 0
  }

  const sectionToUpdate = await Section.findOne({ nrc: sessionNrc })
  const deletedData = await Session.findOneAndDelete({
    day: sessionDay,
    start: sessionStart,
    end: sessionEnd,
    section: new mongoose.mongo.ObjectId(sectionToUpdate._id)
  })

  if (deletedData === undefined || deletedData === null) {
    console.error("ERROR : Could not find session to delete")
    res?.send({ code: 0 })
    return 0
  }
  
  const updatedSection = await Section.findOneAndUpdate(sectionToUpdate,
    { sessions: sectionToUpdate.sessions.filter(id => !id.equals(deletedData._id)) })

  
  res?.send(deletedData)
  return deletedData
}