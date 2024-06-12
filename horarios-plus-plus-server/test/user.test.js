import assert from "assert"
import User from "../src/models/user.model.js"
import UserController from "../src/routes/user/UserController.js"
import { deleteModel } from "mongoose"

describe("User CRUD", () => {
	// NOTE: CREATE USERS
	describe("Create Users", () => {
		it("Create a new user", async () => {
			const addedUser = await UserController.newUser({
				query: {
					type: "alumno",
					email: "alemanhumberto06@gmail.com",
					password: "cocosete1",
					id: "30142718"
				}
			})
			assert(User.checkIfIdExists(addedUser._id))
		})
	})

	// NOTE: READ USERS
	describe("Read Users", () => {
		let toRead
		beforeEach(async () => {
			toRead = await UserController.newUser({
				query: {
					type: "alumno",
					email: "alemanhumberto06@gmail.com",
					password: "cocosete1",
					id: "30142718"
				}
			})
		})

		it("Read a user (ID)", async () => {
			assert(await UserController.getUser({ query: { id: toRead.id } }).then(res => res._id.equals(toRead._id)))
		})
		it("Read a user (EMAIL)", async () => {
			assert(await UserController.getUser({ query: { email: toRead.email } }).then(res => res._id.equals(toRead._id)))
		})
	})

	// NOTE: UPDATE USERS
	describe("Update Users", () => {
		let toUpdate
		beforeEach(async () => {
			toUpdate = await UserController.newUser({
				query: {
					type: "alumno",
					email: "alemanhumberto06@gmail.com",
					password: "cocosete1",
					id: "30142718"
				}
			})
		})

		it("Update a user", async () => {
			const updatedUser = await UserController.updateUser({
				query: {
					id: "30142718",
					email: "theawsomegirl2004@gmail.com",
					password: "cocoloca2",
					type: "profesor",
				}
			})

			assert(updatedUser._id.equals(toUpdate._id) &&
				updatedUser.type === "profesor" &&
				updatedUser.password === "cocoloca2" &&
				updatedUser.email === "theawsomegirl2004@gmail.com"
			)
		})
	})


	// NOTE: DELETE USERS
	describe("Delete Users", () => {
		let toDelete
		beforeEach(async () => {
			toDelete = await UserController.newUser({
				query: {
					type: "alumno",
					email: "alemanhumberto06@gmail.com",
					password: "cocosete1",
					id: "30142718"
				}
			})
		})

		it("Delete a user", async () => {
			const deletedUser = await UserController.deleteUser({
				query: { id: "30142718" }
			})
			assert(await User.checkIfIdExists(deletedUser._id).then(res => !res))
		})
	})
})

