const express = require("express")

const router = express.Router()

const { checkUserAuthenticated, isUserLogin } = require("../controllers/userAuth")

// const { validateWord } = require("../validation_schema/wordValidate")

const wordsListDb = require("../DB/myWordDB.js")

// Login page -> GET /user/login
router.get("/login", isUserLogin, (req, res) => {
 res.render("loginContent", {
  layout: "login",
 })
})

// My Words List page -> GET /user/mylist
router.get("/mylist", checkUserAuthenticated, async (req, res) => {
 try {
  const data = await wordsListDb.getUserWordsList(req.user.googleId)
  console.log("Date Now is: ", Date.now())
  console.log(data)
  res.render("myWordsList", { name: req.user.firstName, data })
 } catch (error) {
  res.render("error/500")
 }
})

// All Words List page -> GET /user/allwords
router.get("/allwords", checkUserAuthenticated, async (req, res) => {
 try {
  const data = await wordsListDb.getAllUsersWordsList()
  console.log("Date Now is: ", Date.now())
  console.log(data)
  res.render("allUsersWordList", { data })
 } catch (error) {
   console.log("Errrrrrrrrrrrrrrrrrrrrrror", error)
  res.render("error/500")
 }
})

module.exports = router
