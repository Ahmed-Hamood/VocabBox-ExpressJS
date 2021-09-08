const Ajv = require("ajv")
const ajv = new Ajv() // options can be passed, e.g. {allErrors: true}

exports.validateWord = (req, res, next) => {
 const schema = {
  type: "object",
  properties: {
   word: { type: "string" },
   available: { type: "string" },
   means: {
    type: "array",
    items: {
     type: "object",
     properties: {
      definition: { type: "string" },
      wordType: { type: "string" },
      examples: { type: "array", items: { type: "string" } },
      rowId: { type: "integer" },
     },
     required: ["definition", "wordType", "examples"],
    },
   },
  },
  required: ["word", "means"],
  additionalProperties: false,
 }

 const validate = ajv.compile(schema)

 const data = req.body

 const valid = validate(data)

 if (!valid) {
  console.log(validate.errors)
  const err = validate.errors
  res.json({ error: `${err[0].instancePath} : ${err[0].message}` })
 } else {
  console.log("validate success")
  next()
 }
}
