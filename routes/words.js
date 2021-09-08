const express = require("express")

const router = express.Router()

const { checkUserAuthenticated } = require("../controllers/userAuth")

const { validateWord } = require("../validation_schema/wordValidate")

const wordsListDb = require("../DB/myWordDB.js")

// Words List page -> GET /word/add
router.get("/add", checkUserAuthenticated, async (req, res) => {
 // add user id
 res.render("addWordForm")
})

// Words List page -> GET /word/add
router.post("/add", checkUserAuthenticated, validateWord, async (req, res) => {
 // add user id
 try {
  req.body.googleId = req.user.googleId
  let result = await wordsListDb.addWordToUser(req.body)
  console.log("Insert Successfully ID:", result.insertedId)
  res.json({ status: "success", payload: req.body })
 } catch (error) {
  res.render("error/500")
 }
})

// Words List page -> GET /word/edit
router.get("/edit/:from/:id", checkUserAuthenticated, async (req, res) => {
 let result

 try {
  result = await wordsListDb.getUserWordById(req.params.id)
  if (result) {
   if (result.googleId != req.user.googleId) {
    res.send("This Vocab doesn't belong to You")
   }
  } else {
   res.render("error/500")
  }
 } catch (err) {
  console.log("Error ", err)
 }

 let _id = JSON.stringify(req.params.id)
 let data = JSON.stringify(result)
 let pageFrom =  JSON.stringify(req.params.from);
 
 let word = result.word;
 let available = result.available;

 res.render("editWordForm", { _id, data, word, available, pageFrom  })
})

// Words List page -> POST /word/edit
router.post("/edit/:id", checkUserAuthenticated, validateWord, async (req, res) => {
 let result

 try {
  result = await wordsListDb.updateUserWordById(req.params.id, req.body)
  if (result) {
   if (result.googleId != req.user.googleId) {
    res.json({ status: "success" })
   }
  } else {
   res.render("error/500")
  }
 } catch (err) {
  console.log("Error ", err)
 }
})

// Words List page -> GET /word/remove
router.get("/remove/:from/:id", checkUserAuthenticated, async (req, res) => {
 let result

 try {
  result = await wordsListDb.getUserWordById(req.params.id)
  if (result) {
   if (result.googleId != req.user.googleId) {
    res.send("This Vocab doesn't belong to You")
   }
  } else {
   res.render("error/500")
  }

  await wordsListDb.removeUserWordById(req.params.id)

  if(req.params.from == "allwords") res.redirect('/user/allwords');
 
  res.redirect('/user/mylist');

 } catch (err) {
  console.log("Error ", err)
 }
})

module.exports = router
