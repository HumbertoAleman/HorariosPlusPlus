import SubjectController from "../Subject/SubjectController.js"
import SectionController from "../Section/SectionController.js"
import SessionController from "../Session/SessionController.js"
import EventController from "../Event/EventController.js"
import ScheduleController from "../Schedule/ScheduleController.js"
import UserController from "../User/UserController.js"

export default class Router {
    static routeToApp = (app) => {
        SubjectController.routeToApp(app)
        SectionController.routeToApp(app)
        SessionController.routeToApp(app)
        EventController.routeToApp(app)

        ScheduleController.routeToApp(app)
        UserController.routeToApp(app)
    }
}