const db = require("./db")
let client;

const CreateNewUserSession = async (userData, done) => {
 try {
  client = await db.init()

  let user = await client.db("VocabBox").collection("users").findOne({ googleId: userData.googleId })

  if (user) {
   done(null, user.googleId)
   console.log("Account Exist OK")
  } else {
   user = await client.db("VocabBox").collection("users").insertOne(userData)
   console.log("Account Created OK")
   done(null, userData)
  }
 } catch (err) {
  console.error(err)
  done("Error while creating a session", false)
 } finally {
  client.close()
 }
}

const checkUserSessionExist = async (id, done) => {

 try {
  client = await db.init()

  let user = await client.db("VocabBox").collection("users").findOne({ googleId: id })

  if (user) {
   done(null, user)
   console.log("Check Account Exist OK - GoogleId:", user.googleId)

   let getID = user._id.toString().substring(0, 8)
   console.log("Created At: ", new Date(parseInt(getID, 16) * 1000))
  } else {
   done("User Not Exist", false)
  }
 } catch (err) {
  console.error(err)
  done(err, false)
 } finally {
  client.close()
 }
}

module.exports = { CreateNewUserSession, checkUserSessionExist }
