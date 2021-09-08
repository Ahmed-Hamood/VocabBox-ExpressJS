const moment = require("moment")

module.exports = {
 formatDate: (date, format) => {
  return moment(date).format(format)
 },
 checkVocabBelongsToUser: (vocabUser, loggedUser, VocabId) => {
  if (vocabUser.googleId == loggedUser.googleId) {
   return `
     <a href="/word/remove/allwords/${VocabId}" class="btn red"> Remove </a>
     <a href="/word/edit/allwords/${VocabId}" class="btn"> Update </a>
     `
  } else {
   return `<span style="color:white;"> Belongs to ${loggedUser.displayName}  </span>`
  }
 },
 selectAvailableOption: val => {
  return `
   <option value=""> Select Available ....</option>
   <option value="public" ${val == "public" ? "selected" : ""}> Public </option>
   <option value="private" ${val == "private" ? "selected" : ""}> Private </option>
   `
 },
}

 