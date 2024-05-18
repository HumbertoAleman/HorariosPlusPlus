import newSubject from "./subject.new_subject.js";

export default function subjectRoutes(app) {
  app.get("/api/subjects/new_subject", newSubject)
}