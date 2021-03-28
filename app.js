const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https")

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));


app.get("/" , function (req, res) {

  res.sendFile(__dirname + "/signup.html");
});

app.post("/" , function (req, res) {

  var firstName = req.body.fName;
  var lastName = req.body.lName;
  var email = req.body.email;


  const data = {
    members : [
    {
      email_address : email,
      status : "subscribed" ,
      merge_fields : {
          FNAME : firstName,
          LNAME : lastName
      }
  
    }
  ]
};

const jsonData = JSON.stringify(data);

const url = "https://us1.api.mailchimp.com/3.0/lists/db677a0740";

const options = {

  method: "POST",
  auth : "Hamid:e453b001ad6538227a6f49bd583b8d83-us1"
  
}

 const requestToSendToMailChimp = https.request(url, options, function(response) {

  if(response.statusCode === 200) {
    res.sendFile(__dirname + "/success.html")
  } else {
    res.sendFile(__dirname + "/failure.html")
  }


  response.on("data" , function(data) {
    console.log(JSON.parse(data));

  });

});

requestToSendToMailChimp.write(jsonData);
requestToSendToMailChimp.end();

});


app.post("/failure.html" , function(req, res) {

  res.redirect("/");
})

app.listen(process.env.PORT || 3000, function () {
  console.log("Server is running on port 3000");
});

