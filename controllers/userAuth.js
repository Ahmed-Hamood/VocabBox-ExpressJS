module.exports = {
 checkUserAuthenticated: (req, res, next) => {
   console.log("isAuthenticated: ", req.isAuthenticated())
  if (req.isAuthenticated()) {
   return next()
  } else {
   res.redirect("/user/login")
  }
 },
 isUserLogin: (req, res, next) => {
  if (req.isAuthenticated()) {
   res.redirect("/user/mylist")
  } else {
   return next()
  }
 },
}
