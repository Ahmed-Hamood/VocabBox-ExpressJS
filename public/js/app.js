console.log(VocabWord)

let rowId = 0
let currentUpdateRow = null

const addWord_btn = document.getElementById("addWord")
const submitWord_btn = document.getElementById("submitWord")
const updateWord_btn = document.getElementById("updateWord")

 

addWord_btn.addEventListener("click", e => {
 let examples = []

 const wordText = document.getElementById("word")
 const available = document.getElementById("available")
 const definition = document.getElementById("definition")
 const wordType = document.getElementById("type")
 const allExamples = document.querySelectorAll(".example")

 e.preventDefault()

 // Update Action
 if (addWord_btn.innerHTML === "Update") {

  allExamples.forEach(text => {
   if (text.value != "") examples.push(text.value)
  })

  if(submitWord_btn) submitWord_btn.disabled = false;
  if(updateWord_btn) updateWord_btn.disabled = false;

 


  if (wordText.value != "" && definition.value != "" && wordType.value != "" && available.value != "" && examples != 0) {
   VocabWord.means.forEach(el => {
    if (el.rowId == currentUpdateRow) {
     el.definition = document.getElementById("definition").value
     el.wordType = document.getElementById("type").value
     el.examples = []
     document.querySelectorAll(".example").forEach(text => {
      if (text.value != "") el.examples.push(text.value)
     })
    }
   })

   document.getElementById("addWord").innerHTML = "Add Word"
   VocabWord.word = document.getElementById("word").value
   VocabWord.available = document.getElementById("available").value

   currentUpdateRow = null
   definition.value = ""
   wordType.value = ""
   examples = []

   document.querySelectorAll(".example").forEach(text => {
    text.value = ""
   })

   console.log(VocabWord)
   ViewResult(VocabWord)
  }
 } else {

  allExamples.forEach(text => {
   if (text.value != "") examples.push(text.value)
  })

  if (wordText.value != "" && definition.value != "" && wordType.value != "" && available.value != "" && examples != 0) {
   VocabWord.word = wordText.value
   VocabWord.available = available.value

   VocabWord.means.push({
    definition: definition.value,
    wordType: wordType.value,
    examples,
    rowId,
   })

   definition.value = ""
   document.getElementById("type").value = ""
   examples = []

   document.querySelectorAll(".example").forEach(text => {
    text.value = ""
   })

   wordText.disabled = true

   rowId++
   
   if (VocabWord.means.length) {
    if(submitWord_btn) submitWord_btn.disabled = false;
    if(updateWord_btn) updateWord_btn.disabled = false;
   }

   console.log(VocabWord)

   ViewResult(VocabWord)
  } else {
   alert("please fill form")
  }
 }
})

// ###################################################
if (submitWord_btn) {
 submitWord_btn.disabled = true
 submitWord_btn.addEventListener("click", e => {
  e.preventDefault()

  VocabWord.available = document.getElementById("available").value

  console.log(JSON.stringify(VocabWord))

  fetch("/word/add", {
   headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
   },
   method: "POST",
   body: JSON.stringify(VocabWord),
  })
   .then(function (res) {
    return res.json()
   })
   .then(function (data) {
    if (data.status === "success") {
     window.location.href = "http://localhost:3000/user/mylist"
    } else {
     alert("error")
    }
   })
   .catch(function (res) {
    console.log(res)
   })
 })
}

if (updateWord_btn) {

 updateWord_btn.addEventListener("click", e => {
  e.preventDefault()

  VocabWord.word = document.getElementById("word").value
  VocabWord.available = document.getElementById("available").value

  console.log(JSON.stringify(VocabWord))

  fetch(`/word/edit/${vocabId}`, {
   headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
   },
   method: "POST",
   body: JSON.stringify(VocabWord),
  })
   .then(function (res) {
    return res.json()
   })
   .then(function (data) {
    if (data.status === "success") {
     window.location.href = `http://localhost:3000/user/${fromPage}`
    } else {
     alert("error")
    }
   })
   .catch(function (res) {
    console.log(res)
   })
 })
}

function ViewResult(VocabWord) {
 let htmlrow = ""
 let tbody = document.getElementById("table_body")
 tbody.innerHTML = ""

 if (VocabWord.means.length != 0) {
  VocabWord.means.forEach(el => {
   htmlrow += `
     <tr id="${el.rowId}">
       <td>${VocabWord.word}</td>
       <td>${el.wordType}</td>
       <td>${el.definition}</td>
       <td>${el.examples.length}</td>
       <td> <a href="#" id="remove_link"> Remove </a> </td>
       <td> <a href="#" id="update_link"> Update </a> </td>
     </tr>
       `
  })
 }

 if (VocabWord.means.length && submitWord_btn) submitWord_btn.disabled = false

 tbody.innerHTML = htmlrow
 remove_btn = document.querySelectorAll("#remove_link")
 update_btn = document.querySelectorAll("#update_link")

 remove_btn.forEach(el => {
  el.addEventListener("click", e => {
   e.preventDefault()
   Remove(e)
  })
 })

 update_btn.forEach(el => {
  el.addEventListener("click", e => {
   e.preventDefault()
   FillForm(e)
  })
 })
}

function Remove(el) {
 const wordText = document.getElementById("word")
 const available = document.getElementById("available")

 let elementIndex = el.target.parentElement.parentElement.getAttribute("id")

 console.log(elementIndex)

 VocabWord.means.forEach((element, index) => {
  if (element.rowId == elementIndex) {
   VocabWord.means.splice(index, 1)
  }
 })

 el.target.parentElement.parentElement.remove()

 if (VocabWord.means.length === 0) {
  wordText.disabled = false

  if(submitWord_btn) submitWord_btn.disabled = true;
  if(updateWord_btn) updateWord_btn.disabled = true;

  rowId = 0
 }

 document.getElementById("addWord").innerHTML = "Add Word"
}

function FillForm(el) {
 const id = el.target.parentElement.parentElement.getAttribute("id")

 document.getElementById("definition").value = VocabWord.means[+id].definition
 document.getElementById("type").value = VocabWord.means[+id].wordType

 VocabWord.means[+id].examples.forEach((element, index) => {
  if (index == 0) document.querySelectorAll(".example")[0].value = element
  if (index == 1) document.querySelectorAll(".example")[1].value = element
  if (index == 2) document.querySelectorAll(".example")[2].value = element
 })

 if(submitWord_btn) submitWord_btn.disabled = true;
 if(updateWord_btn) updateWord_btn.disabled = true;

 document.getElementById("addWord").innerHTML = "Update"
 currentUpdateRow = el.target.parentElement.parentElement.getAttribute("id")
}

ViewResult(VocabWord)
