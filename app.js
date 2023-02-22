"use strict";
const express = require("express");
const bodyParser = require("body-parser");
const mailchimp = require("@mailchimp/mailchimp_marketing");
require("dotenv").config();
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// geting html page rendered
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/signup.html");
});
// hendel post request from form and subscribe audience

app.post("/", (req, res) => {
  const fName = req.body.firstName;
  const lName = req.body.lastName;
  const emails = req.body.email;

  const listId = process.env.LIST_ID;
  const subscribingUser = {
    firstName: fName,
    lastName: lName,
    email: emails,
  };

  mailchimp.setConfig({
    apiKey: process.env.MAILCHIMP_API_KEY,
    server: "us10",
  });
  async function run() {
    const response = await mailchimp.lists
      .addListMember(listId, {
        email_address: subscribingUser.email,
        status: "subscribed",
        merge_fields: {
          FNAME: subscribingUser.firstName,
          LNAME: subscribingUser.lastName,
        },
      })
      .then(
        (value) => {
          console.log("Succssesfully added contact");
          res.sendFile(__dirname + "/public/success.html");
        },
        (reason) => {
          res.sendFile(__dirname + "/public/failure.html");
        }
      );
  }

  run();
});

// spin the server
app.listen(3000, () => {
  console.log("Server start on port 3000");
});
