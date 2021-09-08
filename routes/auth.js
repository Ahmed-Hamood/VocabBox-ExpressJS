const express = require("express")
const passport = require("passport")
const router = express.Router()


// Authenticate with google -> GET - /auth/google
router.get("/google", passport.authenticate("google", { scope: ["profile"] }))

// google callback -> GET - /auth/google/cb
router.get("/google/cb", passport.authenticate("google", { failureRedirect: "/user/login" }), (req, res) => {
 res.redirect("/user/mylist")
})

// logout from google account -> GET - /auth/google/logout
router.get("/google/logout", (req, res) => {
 req.logOut()
 res.redirect("/user/login")
})

module.exports = router
