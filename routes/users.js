const express = require("express")
const router = express.Router()
const bodyParser = require("body-parser")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const config = require("../config")

router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())

const db = require("../models")
const SALT_WF = 10

router.post("/register", (req, res) => {
  const user = req.body.user
  db.User.findOne({ email: user.email }, (err, user) => {
    if (err)
      return res.status(500).send("There was an error validating the email")
    if (user)
      return res.status(200).send({
        isError: true,
        message: "This user already exist."
      })

    const hashedPassword = bcrypt.hashSync(req.body.password, SALT_WF)
    db.User.create(
      {
        email: user.email,
        name: user.name,
        password: hashedPassword,
        isActive: true // TODO: has to be false by default and active by clicking the link on the email
        //TODO: Profile image
      },
      (err, user) => {
        if (err)
          return res
            .status(500)
            .send("There was an error registering the user.")

        const token = jwt.sign({ email: user.email }, config.secret, {
          expiresIn: 3600
        })
        res.setHeader("Access-Control-Allow-Origin", "*")
        res.setHeader(
          "Access-Control-Allow-Headers",
          "Origin, x-Requested-with,content-Type,Accept"
        )
        res.status(201).send(user)
      }
    )
  })
})

router.post("/login", (req, res) => {
  db.User.findOne({ email: req.body.email }, (err, user) => {
    if (err)
      return res.status(500).send({
        auth: false,
        token: null,
        msg: "There was an error retrieving the user."
      })
    if (!user)
      return res
        .status(404)
        .send({ auth: false, token: null, msg: "The user doesn't exist." })
    if (!user.isActive)
      return res.status(404).send({
        auth: false,
        token: null,
        msg: "The user is blocked by the Administrator."
      })

    const isValidPassword = bcrypt.compareSync(req.body.password, user.password)
    if (!isValidPassword)
      return res.status(401).send({
        auth: false,
        token: null,
        msg: "The credentials doesn't match."
      })

    const token = jwt.sign({ email: user.email }, config.secret, {
      expiresIn: 3600
    })
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, x-Requested-with,content-Type,Accept"
    )
    res.status(200).send({ auth: true, token: token })
  })
})

module.exports = router
