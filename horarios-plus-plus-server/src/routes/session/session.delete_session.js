import mongoose from "mongoose"

import Section from "../../models/section.model.js"
import Session from "../../models/session.model.js"
import Schedule from "../../models/schedule.model.js"

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
    res?.send({ message: "ERROR sessionNRC is undefined", code: 0 })
    return { message: "ERROR sessionNRC is undefined", code: 0 }
  } else if (await Section.exists({ nrc: sessionNrc }).then(res => res === null)) {
    res?.send({ message: "ERROR this NRC does not exist", code: 0 })
    return { message: "ERROR this NRC does not exist", code: 0 }
  }

  if (sessionStart.minute === undefined || sessionStart.hour === undefined) {
    res?.send({ message: "ERROR sessionStart is undefined", code: 0 })
    return { message: "ERROR sessionStart is undefined", code: 0 }
  }

  if (sessionEnd.minute === undefined || sessionEnd.hour === undefined) {
    res?.send({ message: "ERROR sessionEnd is undefined", code: 0 })
    return { message: "ERROR sessionEnd is undefined", code: 0 }
  }

  if (sessionDay === undefined) {
    res?.send({ message: "ERROR sessionDay is undefined", code: 0 })
    return { message: "ERROR sessionDay is undefined", code: 0 }
  }

  const sectionToUpdate = await Section.findOne({ nrc: sessionNrc })
  const deletedData = await Session.findOneAndDelete({
    day: sessionDay,
    start: sessionStart,
    end: sessionEnd,
    section: new mongoose.mongo.ObjectId(sectionToUpdate._id)
  })

  if (deletedData === undefined || deletedData === null) {
		// This error should never happen
		res?.send({ message: "ERROR could not find session to delete", code: 0 })
		return { message: "ERROR could not find session to delete", code: 0 }
  }
  
  const updatedSection = await Section.findOneAndUpdate(sectionToUpdate,
    { sessions: sectionToUpdate.sessions.filter(id => !id.equals(deletedData._id)) }, { new: true })
	
	// We want to remove all of the schedules that contain the modified section
	const schedulesToDelete = await Schedule.deleteMany({ sections: new mongoose.mongo.ObjectId(deletedData.section) })

  res?.send(deletedData)
  return deletedData
}
