// index.js
// This is our main server file

// include express
const express = require("express");
// create object to interface with express
const app = express();
const fetch = require("cross-fetch");
const bodyParser = require('body-parser');

// Code in this section sets up an express pipeline

// print info about incoming HTTP request 
// for debugging
app.use(function(req, res, next) {
  console.log(req.method,req.url);
  next();
})

// No static server or /public because this server
// is only for AJAX requests

// respond to all AJAX querires with this message
app.use(bodyParser.json());

// POST REQUEST TO GET INFO FOR CHART STEP 5
app.post("/query/getCDECData", async function(req,res){
  try {
    console.log("getting data");
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let monthNum;
    let text = req.body;
    
    for (let i = 0; i < 12; i++) {
      if (text.month == months[i]) {
        monthNum = i+1;
      }
    }
    
    console.log("it contained this string:", monthNum, " ", text.month);
    
    const api_url = "https://cdec.water.ca.gov/dynamicapp/req/JSONDataServlet?Stations=SHA,ORO,CLE,NML,SNL,DNP,BER&SensorNums=15&dur_code=M&Start="+text.year+"-01-01&End="+text.year+"-12-31";
    //console.log(api_url);
    
    let waterData = await lookupWaterData(api_url);
    let dateKey = text.year+"-"+text.month+"-1 00:00";
    //console.log(dateKey);
    //console.log(typeof(waterData));
    
    var result = [];
    let j = 0;
    for (let i = 0; i < parseInt(Object.keys(waterData).length); i++) {
      
      if (dateKey == waterData[i].date ) {
        console.log(waterData[i].date);
        result.push({
          id: waterData[i].stationId,
          fill: waterData[i].value
        });
        
        console.log("RESULT:", result[j]);
        j++;
      }
    }
    
    //console.log("Sending:", waterData);
    //console.log("DATA: ", Object.keys(waterData).length);

    res.json(result);
  }
  catch(err) {
    res.status(400).send(err);
  }
});

app.post("/query/sendMonth", function(request, response, next) {
  console.log("sending list");
  response.json(["True Grit","Clueless","The Big Lebowsky","Back to the Future"]);  
});

app.use(function (request, response) {
  response.status(404);
  response.send("Backend cannot answer");
})

async function lookupWaterData(link) {
  /*const api_url = "https://cdec.water.ca.gov/dynamicapp/req/JSONDataServlet?Stations=SHA,ORO,CLE,NML,SNL,DNP,BER&SensorNums=15&dur_code=M&Start=2022-01-01&End=2022-12-31";*/
  // Send it off 
  // console.log("GETTING: ", link)
  let fetchResponse = await fetch(link);
  let data = await fetchResponse.json()
  return data;
}

// end of pipeline specification

// Now listen for HTTP requests
// it's an event listener on the server!
const listener = app.listen(3000, function () {
  console.log("The static server is listening on port " + listener.address().port);
});
