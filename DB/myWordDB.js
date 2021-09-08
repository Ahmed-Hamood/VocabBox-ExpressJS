const db = require("./db")
var ObjectId = require("mongodb").ObjectID

let client

const getUserWordsList = async id => {
 console.log(id)
 try {
  client = await db.init()
  let user = await client.db("VocabBox").collection("wordsList").find({ googleId: id }).sort({ word: 1 }).toArray()
  return user
 } catch (err) {
  console.error(err)
 } finally {
  client.close()
 }
}

const getAllUsersWordsList = async () => {
 try {
  client = await db.init()
  let user = await client.db("VocabBox").collection("wordsList").find({ available: "public" }).toArray()
  return user
 } catch (err) {
  console.error(err)
 } finally {
  client.close()
 }
}

const addWordToUser = async data => {
 try {
  client = await db.init()
  return await client.db("VocabBox").collection("wordsList").insertOne(data)
 } catch (error) {
  console.error("Error while inserting a word")
 } finally {
  client.close()
 }
}

const getUserWordById = async id => {
 try {
  client = await db.init()
  let word = await client
   .db("VocabBox")
   .collection("wordsList")
   .findOne({ _id: new ObjectId(id) })
  return word
 } catch (error) {
  console.error("Error while getting a word")
 } finally {
  client.close()
 }
}

const updateUserWordById = async (id, data) => {
 try {
  client = await db.init()
  let word = await client
   .db("VocabBox")
   .collection("wordsList")
   .updateOne({ _id: new ObjectId(id) }, { $set: data })
  return word
 } catch (error) {
  console.error("Error while getting a word")
 } finally {
  client.close()
 }
}

const removeUserWordById = async id => {
 try {
  client = await db.init()
  let word = await client
   .db("VocabBox")
   .collection("wordsList")
   .deleteOne({ _id: new ObjectId(id) })
  return word
 } catch (error) {
  console.error("Error while getting a word")
 } finally {
  client.close()
 }
}

module.exports = { getUserWordsList, addWordToUser, getAllUsersWordsList, getUserWordById, updateUserWordById, removeUserWordById }
