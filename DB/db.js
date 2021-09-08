const { MongoClient } = require("mongodb")

const connectionUrl = process.env.MONGO_URL

const init = () => {
 return MongoClient.connect(connectionUrl, { useNewUrlParser: true, useUnifiedTopology: true })
}

const CheckDatabase = () => {
 init()
  .then(client => {
   console.log("Database is Connected....")
   client.close()
  })
  .catch(err => {
   console.error(err)
   process.exit(1)
  })
}

module.exports = {
 init,
 CheckDatabase,
}
