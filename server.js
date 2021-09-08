const express = require("express")
const express_hbs = require("express-handlebars")
const passport = require("passport")
const dotenv = require("dotenv")
const morgan = require("morgan")
const path = require("path")
const session = require("express-session")
const MongoStore = require("connect-mongo")

// Load config
dotenv.config({ path: "./config/config.env" })

const routes = require("./routes/index.js")
const words = require("./routes/words.js")
const auth = require("./routes/auth.js")

// Passport Config
require("./config/passport")(passport)

// get all database methods from db.js file
const db = require("./DB/db.js")

// initialize our express application
const app = express()

// body parser
app.use(express.json())

// setup morgan login
if (process.env.NODE_ENV === "development") {
 app.use(morgan("dev"))
}

// serve a static folder
app.use(express.static(path.join(__dirname, "public")))

// require formatDate to implemented in handlebar
const { formatDate, checkVocabBelongsToUser, selectAvailableOption } = require("./helpers/hbsMethods")

// setup handlebars template
app.engine("hbs", express_hbs({ helpers: { formatDate, checkVocabBelongsToUser, selectAvailableOption }, extname: ".hbs", defaultLayout: "main" }))
app.set("view engine", "hbs")

// Set a Session
app.use(
 session({
  secret: "AJDUdhn_&je3@@!S92jjdl", // encrypt session
  resave: false, // don't save a session into the client again if nothing is modified
  saveUninitialized: false, // don't create a session till something is stored
  store: MongoStore.create({ mongoUrl: "mongodb://localhost:33333/VocabBox" }),
 })
)

// Set Passport Middleware
app.use(passport.initialize())
app.use(passport.session())

// set local global user
app.use((req, res, next) => {
 console.log("Request User: ", req.user)
 res.locals.myUser = req.user || null
 next()
})

// Routes
app.get("/", (req, res) => res.redirect("/user/login"))
app.use("/user", routes)
app.use("/word", words)
app.use("/auth", auth)

app.use((req, res) => {
 res.render("error/404")
})

// Assign port number from the config file
const PORT = process.env.PORT || 3000

app.listen(PORT, err => {
 if (err) throw Error("Server Error while listening")
 // Start and check the database connection is running then close the connection.

 // check database
 db.CheckDatabase()

 console.log(`Server is Listening on PORT ${PORT}, On ${process.env.NODE_ENV.toUpperCase()} Mode`)
})
