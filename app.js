//jshint esversion:6

import express from "express"
import bodyParser from "body-parser"
import mongoose from "mongoose"

const app = express()
app.use(express.static("public"))
app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({ extended: true }))

mongoose
	.connect("mongodb://127.0.0.1:27017/usersDB")
	.then(() => console.log("Connected to MongoDB"))
	.catch((err) => console.log(err))

const usersSchema = {
	username: String,
	password: String,
}

const User = mongoose.model("User", usersSchema)

app.get("/", (req, res) => {
	res.render("home")
})

app.get("/login", (req, res) => {
	res.render("login")
})

app.get("/register", (req, res) => {
	res.render("register")
})

app.post("/register", (req, res) => {
	const newUser = new User({
		username: req.body.username,
		password: req.body.password,
	})
	newUser
		.save()
		.then(() => res.render("secrets"))
		.catch((error) => console.log(error))
})

app.post("/login", (req, res) => {
	const username = req.body.username
	const password = req.body.password

    User.findOne({ username: username})
        .then((foundUser) => {
            if (foundUser) {
                if (foundUser.password === password) {
                    res.render("secrets")
                } else {
                    console.log("Passwords do not match")
                }
            } else {
                console.log(`Account not found`)
            }
        })

})

app.listen(3000, (req, res) => {
	console.log("listening on port 3000")
})
