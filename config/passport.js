const googleStrategy = require("passport-google-oauth20").Strategy
const userDb = require("../DB/userDB")

module.exports = passport => {
 // 1. Create google strategy
 passport.use(
  new googleStrategy(
   {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/cb",
   },
   async (accessToken, refreshToken, profile, done) => {
    console.log("accessToken: ", accessToken)
    console.log("refreshToken: ", refreshToken)

    const userData = {
     googleId: profile.id,
     displayName: profile.displayName,
     firstName: profile.name.givenName,
     lastName: profile.name.familyName,
     image: profile.photos[0].value
    }

    // check then store the session into the database
    userDb.CreateNewUserSession(userData, done)
   }
  )
 )

 // generate and create user session here 
 passport.serializeUser((user, done) => {
  console.log("###### serializeUser ######")
  done(null, user) // user -> googleId
 })

 passport.deserializeUser((id, done) => {
  console.log("###### deserializeUser ######")
  userDb.checkUserSessionExist(id, done) 
 })
}
