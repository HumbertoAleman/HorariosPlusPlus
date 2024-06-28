import SubjectController from "../subject/SubjectController.js"
import SectionController from "../section/SectionController.js"
import SessionController from "../session/SessionController.js"

export default class Router {
    static routeToApp = (app) => {
        SubjectController.routeToApp(app)
        SectionController.routeToApp(app)
        SessionController.routeToApp(app)
    }
}